import { QuejasSugerencias } from "../models/Entity/QuejasSugerencias.js";
import { createToken } from "../utils/generateJWT.js";

export class QuejasSugerenciasService {
  async addQuejasSugerenciasService(data) {
    const { type, content } = data.body;
    const userSolapin = data.solapin;
    try {
      const newFeedback = await QuejasSugerencias.create({
        tipo: type,
        contenido: content,
        usuarioSolapin: userSolapin,
        estado: "pendiente", // Estado inicial por defecto
      });

      return {
        success: true,
        status: 201,
        message: `${type} creada exitosamente`,
        data: newFeedback,
      };
    } catch (error) {
      console.error("Error al crear queja/sugerencia:", error);
      return {
        success: false,
        status: 500,
        message: "Error al crear la queja/sugerencia",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      };
    }
  }

  async getQuejasSugerenciasService(data) {
    try {
      let { page = 1, limit = 10 } = data.query;
      console.log(page);
      console.log(limit);
      // Validación
      page = parseInt(page);
      limit = parseInt(limit);
      if (isNaN(page) || page < 1) page = 1;
      if (isNaN(limit) || limit < 1 || limit > 100) limit = 10; // Máximo 100 items

      const offset = (page - 1) * limit;

      const { count, rows } = await QuejasSugerencias.findAndCountAll({
        limit: limit,
        offset: offset,
      });

      if (count === 0)
        return {
          success: false,
          message: `No se encontro ningun documento`,
        };

      const totalPages = Math.ceil(count / limit);

      return {
        token: createToken(data.solapin),
        success: true,
        status: 200,
        message: "Resultados Obtenidos ...",
        totalPages,
        results: rows,
      };
    } catch (error) {
      console.error("Error al crear queja/sugerencia:", error);
      return {
        success: false,
        status: 500,
        message: "Error al crear la queja/sugerencia",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      };
    }
  }

  async deleteQuejasSugerenciasService(data) {
    const userSolapin = data.solapin;
    const { idQueja } = data.params;

    try {
      // 1. Buscar el documento
      const feedback = await QuejasSugerencias.findOne({
        where: {
          usuarioSolapin: userSolapin,
          id_queja_sugerencia: parseInt(idQueja),
        },
      });

      if (!feedback) {
        return {
          success: false,
          status: 404, // Not Found
          message: `No se encontro esta queja o sugerencia`,
        };
      }

      // 2. Eliminar el documento (físicamente)
      await feedback.destroy({ force: true });

      // 3. Verificación adicional (opcional pero recomendada)
      const feedbackDeleted = await QuejasSugerencias.findOne({
        where: {
          usuarioSolapin: userSolapin,
          id_queja_sugerencia: parseInt(idQueja),
        },
      });

      console.log(feedbackDeleted);

      if (feedbackDeleted) {
        console.error(`No se eliminó físicamente la queja o la sugerencia`);
        return {
          success: false,
          status: 500,
          message: `Error interno: No se pudo eliminar la queja o la sugrencia`,
        };
      }

      // 4. Respuesta exitosa
      return {
        success: true,
        status: 200,
        message: `Eliminado correctamente`,
        token: createToken(data.solapin),
      };
    } catch (error) {
      console.error(
        `Error al eliminar "la queja o la sugerencia":`,
        error.message
      );
      return {
        success: false,
        status: 500,
        message: `Error interno al intentar eliminar "La queja o la sugrencia"`,
        errorDetails:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      };
    }
  }

  async setStateQuejasSugerenciasService(data) {
    try {
      const { idQueja } = data.params; // ID de la queja
      const { newState } = data.body; // 'pendiente', 'revisado' o 'resuelto'

      // Validar el estado
      const estadosValidos = ["pendiente", "revisado", "resuelto"];
      if (!estadosValidos.includes(newState)) {
        return {
          status: 400,
          success: false,
          message: "Estado no válido",
        };
      }

      // Buscar y actualizar
      const queja = await QuejasSugerencias.findOne({
        where: {
          id_queja_sugerencia: idQueja,
        },
      });

      if (!queja) {
        return {
          status: 404,
          success: false,
          message: "Queja no encontrada",
        };
      }

      const quejaActualizada = await queja.update({ estado: newState });

      return {
        status: 200,
        success: true,
        message: "Estado actualizado correctamente",
        data: quejaActualizada,
      };
    } catch (error) {
      console.error(
        `Error al cambiar el estado de "la queja o la sugerencia":`,
        error.message
      );
      return {
        success: false,
        status: 500,
        message: `Error al cambiar el estado de "la queja o la sugerencia"`,
        errorDetails:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      };
    }
  }
}
