import { Router } from "express";
import { QuejasSugerenciasController } from "../controllers/quejasSugerencias.controller.js";
import { QuejasSugerenciasService } from "../services/quejasSugerencias.service.js";
import { validationInsertQuejasSugerencias, validationUpdateQuejasSugerencias } from "../middlewares/quejassugerenciasMiddlewares.js";

export const createQuejasSugerenciasRoutes = () => {
    const router = Router();

    const quejasSugerenciasService = new QuejasSugerenciasService();
    const quejasSugerenciasController = new QuejasSugerenciasController(quejasSugerenciasService);

    //Insertar una queja o una sugerencia
    router.post('/',validationInsertQuejasSugerencias,(req,res)=>quejasSugerenciasController.addQuejasSugerenciasController(req,res));

    //Obtener quejas y sugerencias de los usuarios
    router.get('/', (req,res)=>quejasSugerenciasController.getQuejasSugerenciasController(req,res));
    
    //Eliminar la queja y la sugerencia
    router.delete('/:idQueja',(req,res)=>quejasSugerenciasController.deleteQuejasSugerenciasController(req,res));

    //Cambiarle el estado a la quea o la sugerencia
    router.put('/:idQueja',validationUpdateQuejasSugerencias,(req,res)=>quejasSugerenciasController.setStateQuejasSugerenciasController(req,res));

    return router;
}