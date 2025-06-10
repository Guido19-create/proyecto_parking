import { Router } from "express";
import { SolicitudService } from "../services/solicitud.service.js";
import { SolicitudController } from "../controllers/solicitud.controller.js";
import { verifyIsBibliotecary } from "../middlewares/userMiddlewares.js";
import { validationsCreateSolicitud, verificarSiPuedeCancelarSolicitud } from "../middlewares/solicitudMiddlewares.js";

export const createSolicitudRoutes = () => {
    const router = Router();

    const solicitudService = new SolicitudService();
    const solicitudController = new SolicitudController(solicitudService);

    //Generar una solicitud de un usuario hacia un documneto
    router.post('/',validationsCreateSolicitud, (req,res) => solicitudController.createSolicitudController(req,res));
    
    //Cancelar solicitud
    router.delete('/:code',verificarSiPuedeCancelarSolicitud,(req,res) => solicitudController.cancelSolicitudController(req,res));

    //Buscar solicitud por codigo
    router.get('/:code',verifyIsBibliotecary,(req,res) => solicitudController.searchSolicitudForCodeController(req,res));

    //Obtener solicitudes de forma paginada
    router.get('/',verifyIsBibliotecary,(req,res) => solicitudController.getSolicitudesALLController(req,res));


    return router;
}