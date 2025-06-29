import { Router } from "express"
import { createAuthRoutes } from "./auth.routes.js";
import { createDocumentRoutes } from "./document.routes.js";
import { verifyToken } from "../middlewares/authMiddlewares.js";
import { createQuejasSugerenciasRoutes } from "./quejasSugerencias.routes.js";
import { createSolicitudRoutes } from "./solicitud.routes.js";
import { createPrestamoRoutes } from "./prestamo.routes.js";
import { createDevolucionRoutes } from "./devolucion.routes.js";
import { createUserRoutes } from "./user.routes.js";

export const createRoutes = () => {
    const router = Router();

    //Login
    router.use('/auth', createAuthRoutes());
    //Crud de Documnetos
    router.use('/document',verifyToken)
    router.use('/document',createDocumentRoutes());
    
    //Crud de Quejas y sugerencias
    router.use('/quejassugerencias',verifyToken)
    router.use('/quejassugerencias',createQuejasSugerenciasRoutes());
    
    //Crud de solicitudes
    router.use('/solicitar',verifyToken)
    router.use('/solicitar',createSolicitudRoutes());
    
    router.use('/prestamo',verifyToken)
    router.use('/prestamo',createPrestamoRoutes());
    
    router.use('/devolucion',verifyToken)
    router.use('/devolucion',createDevolucionRoutes());
    
    router.use('/user',verifyToken)
    router.use('/user',createUserRoutes( ));


    return router;
}