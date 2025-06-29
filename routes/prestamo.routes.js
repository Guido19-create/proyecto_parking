import { Router } from "express";
import { PrestamoService } from "../services/prestamo.service.js";
import { PrestamoController } from "../controllers/prestamo.controller.js";
import { validationsCreatePrestamos } from "../middlewares/prestamoMiddlewares.js";
import { verifyIsBibliotecary } from "../middlewares/userMiddlewares.js";

export const createPrestamoRoutes = () => {
  const router = Router();

  const prestamoService = new PrestamoService();
  const prestamoController = new PrestamoController(prestamoService);

  //Hacer un prestamo
  router.post("/", validationsCreatePrestamos, (req, res) =>
    prestamoController.createPrestamoController(req, res)
  );

  //Obtener todos lo prestamos(paginados)(filtar por estado)
  router.get("/", verifyIsBibliotecary, (req, res) =>
    prestamoController.getPrestamosController(req, res)
  );

  //Actualizar un prestamo
  router.put("/:id", verifyIsBibliotecary, (req, res) =>
    prestamoController.updatePrestamoController(req, res)
  );

  //Eliminar un prestamo
  router.delete("/:id", verifyIsBibliotecary, (req, res) =>
    prestamoController.deletePrestamoController(req, res)
  );

  return router;
};
