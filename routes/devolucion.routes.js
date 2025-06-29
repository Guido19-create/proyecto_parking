import { Router } from "express";
import { DevolucionService } from "../services/devolucion.service.js";
import { DevolucionController } from "../controllers/devolucion.controller.js";;
import { validationCreateDevolucion } from "../middlewares/devolucionMiddlewares.js";
import { verifyIsBibliotecary } from "../middlewares/userMiddlewares.js";

export const createDevolucionRoutes = () => {
    const router = Router();

    const devolucionService = new DevolucionService();
    const devolucionController = new DevolucionController(devolucionService);

    //Registrar devolucion
    router.post('/',validationCreateDevolucion,(req,res)=>devolucionController.createDevolucionController(req,res));

    //Obtener todas las devoluciones
    router.get('/',verifyIsBibliotecary,(req,res)=>devolucionController.getDevolucionesAllController(req,res));
    
    return router;
}