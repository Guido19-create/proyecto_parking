import { v4 as uuidv4 } from "uuid";
import { createToken } from "../utils/generateJWT.js";
import { Op } from "sequelize";
import { Documentos } from "../models/Entity/Documentos.js";
import { Usuarios } from "../models/Entity/Usuario.js";
import { Solicitudes } from "../models/Entity/Solicitudes.js";
import { sequelize } from "../config/databaseConection.js";

export class SolicitudService {
  async createSolicitudService(data) {
    try {
      const { documentId } = data.body;
      const userSolapin = data.solapin;

      // Verificar que el documento existe
      const documento = await Documentos.findOne({
        where: {
          id_documento: documentId,
          Disponibilidad: true,
        },
      });
      if (!documento) {
        return {
          success: false,
          status: 404,
          message: "Documento no encontrado",
        };
      }

      // Verificar que el usuario existe
      const usuario = await Usuarios.findByPk(userSolapin);
      if (!usuario) {
        return {
          success: false,
          status: 404,
          message: "Usuario no encontrado",
        };
      }

      // Generar código único
      const code = `SOL-${uuidv4().substring(0, 8).toUpperCase()}`;

      // Crear solicitud con expiración (1 día desde ahora)
      const fechaDeExpiracion = new Date();
      fechaDeExpiracion.setDate(fechaDeExpiracion.getDate() + 1);

      const newSolicitud = await Solicitudes.create({
        codigo: code,
        documentoId: documentId,
        usuarioSolapin: userSolapin,
        fechaDeExpiracion,
        estadoSolicitud: "pendiente",
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
        message: "Solicitud creada exitosamente",
        data: newSolicitud,
        token: createToken(data.solapin),
      };
    } catch (error) {
      console.error("Error al crear solicitud:", error);
      return {
        success: false,
        status: 500,
        message: "Error al crear la solicitud",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      };
    }
  }

  async searchSolicitudForCodeService(data) {
    const { code } = data.params;
    try {
      const solicitud = await Solicitudes.findOne({
        where: {
          codigo: code,
          fechaDeExpiracion: { [Op.gte]: new Date() }, // Solo si no ha expirado
        },
        include: [
          {
            model: Usuarios,
            as: "solicitante",
            attributes: ["solapin", "nombre"],
          },
          {
            model: Documentos,
            as: "documento",
            attributes: [
              "id_documento",
              "nombreDocumento",
              "autor",
              "tipoDeDocumento",
            ],
          },
        ],
      });

      if (!solicitud) {
        return {
          success: false,
          status: 404,
          message: "Solicitud no encontrada o ha expirado",
        };
      }

      return {
        success: true,
        status: 200,
        token: createToken(data.solapin),
        data: solicitud,
      };
    } catch (error) {
      console.error("Error al buscar solicitud:", error);
      return {
        success: false,
        status: 500,
        message: "Error al buscar la solicitud",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      };
    }
  }

  async getSolicitudesALLService(data) {
    try {
      let { page = 1, limit = 10 } = data.query;

      // Validación
      page = parseInt(page);
      limit = parseInt(limit);
      if (isNaN(page) || page < 1) page = 1;
      if (isNaN(limit) || limit < 1 || limit > 100) limit = 10; // Máximo 100 items

      const offset = (page - 1) * limit;

      const { count, rows } = await Solicitudes.findAndCountAll({
        limit: limit,
        offset: offset,
      });

      if (count === 0)
        return {
          success: false,
          status: 400,
          message: `No se encontro ningun documento`,
        };

      const totalPages = Math.ceil(count / limit);

      return {
        token: createToken(data.solapin),
        success: true,
        status: 200,
        solicitudesTotal: count,
        message: "Resultados Obtenidos ...",
        totalPages,
        results: rows,
      };
    } catch (error) {
      console.error("Error al buscar las solicitudes:", error);
      return {
        success: false,
        status: 500,
        message: "Error al buscar las solicitudes",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      };
    }
  }

  async cancelSolicitudService(data) {
    const { code } = data.params;

    try {
      // 1. Buscar el documento
      const solicitud = await Solicitudes.findOne({
        where: { codigo: code },
      });

      if (!solicitud) {
        return {
          success: false,
          status: 404, // Not Found
          message: `No se encontro la solicitud con codigo "${code}"`,
        };
      }

      const [numRowsUpdated] = await Documentos.update(
        {
          Disponibilidad: true,
          cantidadDisponible: sequelize.literal('cantidadDisponible + 1')
        },
        {
          where: {id_documento: solicitud.documentoId}
        }
      );

      if (numRowsUpdated === 0) {
        console.error(`No se pudo eliminar la solicitud "${code}"`);
        return {
          success: false,
          status: 500,
          message: `Error interno: No se pudo eliminar "${code}"`,
        };
      }

      // 2. Eliminar el documento (físicamente)
      await solicitud.destroy({ force: true });

      // 3. Verificación adicional (opcional pero recomendada)
      const solicitudEliminada = await Solicitudes.findOne({
        where: { codigo: code },
        paranoid: false, // Busca incluso los borrados lógicamente
      });

      if (solicitudEliminada) {
        console.error(`No se pudo eliminar la solicitud "${code}"`);
        return {
          success: false,
          status: 500,
          message: `Error interno: No se pudo eliminar "${code}"`,
        };
      }

      // 4. Respuesta exitosa
      return {
        success: true,
        status: 200,
        message: `"Se elimino su solicitud correctamente`,
        token: createToken(data.solapin),
      };
    } catch (error) {
      console.error(`Error al eliminar "${code}":`, error.message);
      return {
        success: false,
        status: 500,
        message: `Error interno al intentar eliminar "${code}"`,
        errorDetails:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      };
    }
  }
}
