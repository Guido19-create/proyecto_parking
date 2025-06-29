import { Prestamos } from "../models/Entity/Prestamos.js";
import { Documentos } from "../models/Entity/Documentos.js";
import { Usuarios } from "../models/Entity/Usuario.js";
import { Op } from "sequelize";
import { createToken } from "../utils/generateJWT.js";
import { sequelize } from "../config/databaseConection.js";

export class PrestamoService {
  async createPrestamoService(data) {
    try {
      const { usuarioSolapin, documentoId, fechaDeEntrega } = data.body;

      // Verificar que el documento existe
      const documento = await Documentos.findByPk(documentoId);

      if (!documento) {
        return {
          status: 404,
          success: false,
          message: "Documento no encontrado",
        };
      }

      // Verificar que el usuario existe
      const usuario = await Usuarios.findByPk(usuarioSolapin);
      if (!usuario) {
        return {
          status: 404,
          success: false,
          message: "Usuario no encontrado",
        };
      }

      // Crear el préstamo
      const prestamo = await Prestamos.create({
        usuarioSolapin,
        documentoId,
        fechaDelPrestamo: new Date(),
        fechaDeEntrega,
        estado: "activo",
      });

      const cantidadDisponibleDocumentos = documento.cantidadDisponible - 1;

      if (cantidadDisponibleDocumentos === 0) {
        await documento.update({
          Disponibilidad: false,
          cantidadDisponible: cantidadDisponibleDocumentos,
        });
      }

      await documento.update({
        cantidadDisponible: cantidadDisponibleDocumentos,
      });

      return {
        success: true,
        status: 201,
        message: "Prestamo creado correctamente",
        token: createToken(data.solapin),
        data: prestamo,
      };
    } catch (error) {
      console.error(`Error al crear un prestamo`, error.message);
      return {
        success: false,
        status: 500,
        message: `Error interno al intentar crear prestamo`,
        errorDetails:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      };
    }
  }

  async getPrestamosService(data) {
    try {
      const {
        page = 1,
        pageSize = 10,
        estado,
        fechaInicio,
        fechaFin,
        usuarioSolapin,
        documentoId,
      } = data.query;

      const offset = (page - 1) * pageSize;
      const where = {};

      // Filtros básicos
      if (estado) where.estado = estado;
      if (usuarioSolapin) where.usuarioSolapin = usuarioSolapin;
      if (documentoId) where.documentoId = documentoId;

      // Filtro por rango de fechas
      if (fechaInicio && fechaFin) {
        where.fechaDelPrestamo = {
          [Op.between]: [new Date(fechaInicio), new Date(fechaFin)],
        };
      } else if (fechaInicio) {
        where.fechaDelPrestamo = { [Op.gte]: new Date(fechaInicio) };
      } else if (fechaFin) {
        where.fechaDelPrestamo = { [Op.lte]: new Date(fechaFin) };
      }

      const { count, rows: prestamos } = await Prestamos.findAndCountAll({
        where,
        include: [
          {
            model: Usuarios,
            as: "usuario",
            attributes: ["solapin", "nombre"], // SOLO CAMPOS QUE EXISTEN
          },
          {
            model: Documentos,
            as: "documento",
            attributes: ["id_documento", "nombreDocumento", "autor"],
          },
        ],
        limit: parseInt(pageSize),
        offset: parseInt(offset),
        order: [["fechaDelPrestamo", "DESC"]],
      });

      if (count === 0)
        return {
          total: count,
          status: 404,
          page: parseInt(page),
          pageSize: parseInt(pageSize),
          totalPages: Math.ceil(count / pageSize),
          data: prestamos,
        };

      return {
        total: count,
        status: 200,
        page: parseInt(page),
        pageSize: parseInt(pageSize),
        totalPages: Math.ceil(count / pageSize),
        data: prestamos,
      };
    } catch (error) {
      console.error(`Error al obtener los prestamo`, error.message);
      return {
        success: false,
        status: 500,
        message: `Error interno al intentar obtener prestamo`,
        errorDetails:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      };
    }
  }

  async updatePrestamoService(data) {
    try {
      const { id } = data.params;
      const { fechaDeEntrega, estado } = data.body;

      const prestamo = await Prestamos.findByPk(id);
      console.log(prestamo);
      if (!prestamo) {
        return {
          message: "Préstamo no encontrado",
          success: false,
          status: 404,
        };
      }

      // Solo permitir actualizar ciertos campos
      if (fechaDeEntrega) prestamo.fechaDeEntrega = fechaDeEntrega;
      if (estado) prestamo.estado = estado;

      await prestamo.save();

      return {
        message: "Préstamo actualizado",
        success: true,
        status: 200,
      };
    } catch (error) {
      console.error(`Error al actualizar el prestamo`, error.message);
      return {
        success: false,
        status: 500,
        message: `Error interno al intentar actualizar el prestamo`,
        errorDetails:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      };
    }
  }

  async deletePrestamoService(data) {
    try {
      const { id } = data.params;

      const prestamo = await Prestamos.findByPk(id);
      if (!prestamo) {
        return {
          message: "Préstamo no encontrado",
          success: false,
          status: 404,
        };
      }

      // Verificar si el préstamo puede ser eliminado (por ejemplo, no completado)
      if (prestamo.estado === "completado") {
        return {
          message: "No se puede eliminar un préstamo completado",
          success: false,
          status: 400,
        };
      }

      await prestamo.destroy();

      const [numRowsUpdated] = await Documentos.update(
        {
          Disponibilidad: true,
          cantidadDisponible: sequelize.literal("cantidadDisponible + 1"),
        },
        {
          where: { id_documento: prestamo.documentoId },
        }
      );

      return {
        message: "Préstamo eliminado correctamente",
        success: true,
        status: 200,
      };
    } catch (error) {
      console.error(`Error al eliminar el prestamo`, error.message);
      return {
        success: false,
        status: 500,
        message: `Error interno al intentar eliminar prestamo`,
        errorDetails:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      };
    }
  }
}
