import { Router } from "express"
import { createAuthRoutes } from "./auth.routes.js";
import { createDocumentRoutes } from "./document.routes.js";
import { verifyToken } from "../middlewares/authMiddlewares.js";

export const createRoutes = () => {
    const router = Router();

    //Login
    router.use('/auth', createAuthRoutes());
    //Crud de Documnetos
    router.use('/document',verifyToken)
    router.use('/document',createDocumentRoutes());

    return router;
}