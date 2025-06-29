import { sequelize } from "../config/databaseConection.js";
import { Devoluciones } from "../models/Entity/Devoluciones.js";
import { Documentos } from "../models/Entity/Documentos.js";
import { Prestamos } from "../models/Entity/Prestamos.js";

export class DevolucionService {
  async createDevolucionService(data) {
    try {
      const {
        fechaDevolucion,
        estadoDelDocumento,
        observaciones = "",
        diasRetraso,
        prestamoId,
        estadoDelPrestamo,
      } = data.body;

      const prestamo = await Prestamos.findByPk(prestamoId);

      if (!prestamo) {
        return {
          status: 400,
          success: false,
          message: "El prestamo no existe",
        };
      }

      const devolucion = await Devoluciones.create({
        fechaDevolucion,
        estadoDelDocumento,
        observaciones,
        diasRetraso,
        prestamoId,
      });

      const [numRowsUpdated] = await Documentos.update(
        {
          Disponibilidad: true,
          cantidadDisponible: sequelize.literal("cantidadDisponible + 1"),
        },
        {
          where: { id_documento: prestamo.documentoId },
        }
      );

      const [rows] = await Prestamos.update(
        {
          estado: estadoDelPrestamo,
        },
        {
          where: { id_prestamos: prestamoId },
        }
      );

      return {
        status: 200,
        success: false,
        message: "Devolucion registrada correctamente",
        data: devolucion,
      };
    } catch (error) {
      console.error("Error al registrar la devolucion:", error);
      return {
        message: "No se pudo registrar la devolucion",
        success: false,
        status: 500,
        error: error.message,
      };
    }
  }

  async getDevolucionesAllService(data) {
    try {
      let { page = 1, limit = 10 } = data.query;

      // Validación
      page = parseInt(page);
      limit = parseInt(limit);
      if (isNaN(page) || page < 1) page = 1;
      if (isNaN(limit) || limit < 1 || limit > 100) limit = 10; // Máximo 100 items

      const offset = (page - 1) * limit;

      const { count, rows } = await Devoluciones.findAndCountAll({
        limit: limit,
        offset: offset,
      });

      if (count === 0)
        return {
          success: false,
          status:404,
          message: `No se encontro ninguna devolucion `,
        };

      const totalPages = Math.ceil(count / limit);

      return {
        success: true,
        status: 200,
        message: "Resultados Obtenidos ...",
        totalPages,
        results: rows,
        totalDevoluciones: count,
      };
    } catch (error) {
      console.error("Error al obtener la devolucion:", error);
      return {
        message: "No se pudo obtener las devoluciones",
        success: false,
        status: 500,
        error: error.message,
      };
    }
  }
}
