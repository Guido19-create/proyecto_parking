import { check } from "express-validator";
import { validationsErrors } from "./validationErrors.js";
import { verifyIsBibliotecary } from "./userMiddlewares.js";


export const validationsCreatePrestamos = [
    verifyIsBibliotecary, 
    check('usuarioSolapin','El solapin es obligatorio').notEmpty(),
    check('documentoId','EL id del documento es obligatorio').notEmpty(),
    check('fechaDeEntrega','La fech de entrega es obligatoria').notEmpty(),
    validationsErrors
];
