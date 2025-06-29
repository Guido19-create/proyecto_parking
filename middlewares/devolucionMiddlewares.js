import { check } from "express-validator";
import { verifyIsBibliotecary } from "./userMiddlewares.js";


export const validationCreateDevolucion = [
    check('fechaDevolucion','La fecha para registrar la devoloucion es obligatoria').notEmpty(),
    check('estadoDelDocumento','El estado del documento es obligatorio').notEmpty(),
    check('prestamoId','El id del prestamo es obligatorio').notEmpty(),
    check('estadoDelDocumento','El estado del documento es obligatorio').notEmpty(),
    verifyIsBibliotecary
]