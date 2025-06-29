import { Router } from "express";
import { UserService } from "../services/user.service.js";
import { UserController } from "../controllers/user.controller.js";
import { verifyIsBibliotecary } from "../middlewares/userMiddlewares.js";

export const createUserRoutes = () => {
    const router = Router();

    const userService = new UserService();
    const userController = new UserController(userService);

    //Obtener todos los usuarios
    router.get('/',verifyIsBibliotecary,(req,res) => userController.getUserAllController(req,res));

    //Obtener usuario por Id
    router.get('/:solapin',verifyIsBibliotecary,(req,res) => userController.getUserForSolapinController(req,res));

    return router;
}