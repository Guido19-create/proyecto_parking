import cron from "node-cron";
import { Solicitudes } from "../models/Entity/Solicitudes.js";
import { Documentos } from "../models/Entity/Documentos.js";
import { Op } from "sequelize";
import { sequelize } from "../config/databaseConection.js";

export const deleteSolicitudesExpiradas = () => {
  cron.schedule("* * * * *", async () => {
    try {
      const ahora = new Date();
      const tiempoExpiracion =  24 * 60 * 60 * 1000; // 2 minutos en milisegundos
      const limiteExacto = new Date(ahora.getTime() - tiempoExpiracion);

      console.log(
        `[${ahora.toISOString()}] Verificando solicitudes >2 minutos...`
      );

      // 1. Buscar solicitudes creadas hace más de 2 minutos
      const solicitudesExpiradas = await Solicitudes.findAll({
        where: {
          createdAt: {
            [Op.lt]: limiteExacto,
          },
        },
        include: {
          model: Documentos,
          as: "documento",
        },
      });

      if (solicitudesExpiradas.length === 0) {
        console.log("No hay solicitudes expiradas (>24 horas)");
        return;
      }

      // 2. Procesar cada solicitud
      for (const solicitud of solicitudesExpiradas) {
        const documentoId = solicitud.documentoId;

        // Verificar si hay otras solicitudes para el mismo documento
        // CORRECCIÓN: Usar id_solicitudes en lugar de id
        const otrasSolicitudes = await Solicitudes.count({
          where: {
            documentoId: documentoId,
            id_solicitudes: { [Op.ne]: solicitud.id_solicitudes },
          },
        });

        // Liberar documento si no hay más solicitudes
        if (otrasSolicitudes === 0) {
          await Documentos.update(
            {
              Disponibilidad: true,
              cantidadDisponible: sequelize.literal("cantidadDisponible + 1"),
            }, // Asegúrate que coincida con el nombre de columna
            { where: { id_documento: documentoId } }
          );
          console.log(`✅ Documento ${documentoId} marcado como disponible`);
        }
      }

      // 3. Eliminar las solicitudes expiradas
      const eliminadas = await Solicitudes.destroy({
        where: {
          createdAt: { [Op.lt]: limiteExacto },
        },
      });

      console.log(`🗑️ Eliminadas ${eliminadas} solicitudes (>2 minutos)`);
      console.log("----------------------------------");
    } catch (error) {
      console.error("❌ Error:", error.message);
    }
  });

  console.log(
    "⏱️ Cron iniciado: Eliminación de solicitudes >2 minutos cada minuto"
  );
};
