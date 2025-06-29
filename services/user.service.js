import { Usuarios } from "../models/Entity/Usuario.js";

export class UserService {
  async getUserAllService(data) {
    try {
      let { page = 1, limit = 10 } = data.query;

      // Validación
      page = parseInt(page);
      limit = parseInt(limit);
      if (isNaN(page) || page < 1) page = 1;
      if (isNaN(limit) || limit < 1 || limit > 100) limit = 10; // Máximo 100 items

      const offset = (page - 1) * limit;

      const { count, rows } = await Usuarios.findAndCountAll({
        limit: limit,
        offset: offset,
      });

      if (count === 0)
        return {
          success: false,
          status: 400,
          message: `No se encontro ningun usuario`,
        };

      const totalPages = Math.ceil(count / limit);

      return {
        success: true,
        status: 200,
        solicitudesTotal: count,
        message: "Resultados Obtenidos ...",
        totalPages,
        results: rows,
      };
    } catch (error) {
      console.error("Error al buscar las usuarios:", error);
      return {
        success: false,
        status: 500,
        message: "Error al buscar los usuarios",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      };
    }
  }

  async getUserForSolapinService(data) {
    try {
      const { solapin } = data.params;

      const user = await Usuarios.findByPk(solapin);

      if (!user) {
        return {
          success: false,
          status: 404,
          message: "Usuario no encontrado",
        };
      }

      return {
        success: true,
        status: 200,
        message: "Resultados...",
        data: user,
      };
    } catch (error) {
      console.error("Error al buscar el usuario:", error);
      return {
        success: false,
        status: 500,
        message: "Error al buscar el usuario",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      };
    }
  }
}
