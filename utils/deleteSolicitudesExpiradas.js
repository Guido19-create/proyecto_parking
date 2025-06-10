import cron from "node-cron";
import { Solicitudes } from "../models/Entity/Solicitudes.js";
import { Op } from "sequelize";

export const deleteSolicitudesExpiradas = () => {
  cron.schedule("* * * * *", async () => {
    try {
      const ahora = new Date();
      const limiteExacto = new Date(ahora.getTime() - 24 * 60 * 60 * 1000);

      console.log(
        `[${ahora.toISOString()}] Verificando solicitudes a eliminar...`
      );

      const eliminadas = await Solicitudes.destroy({
        where: {
          createdAt: {
            [Op.between]: [
              new Date(limiteExacto.getTime() - 60000), // 1 minuto antes
              limiteExacto, // Timestamp exacto de 24 horas
            ],
          },
        },
      });

      if (eliminadas > 0) {
        console.log(
          `Eliminadas ${eliminadas} solicitudes cumpliendo 24 horas exactas`
        );
      }
    } catch (error) {
      console.error("Error en limpieza automática:", error);
    }
  });
};
