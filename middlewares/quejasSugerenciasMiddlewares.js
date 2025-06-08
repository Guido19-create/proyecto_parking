import { check } from "express-validator";
import { validationsErrors } from "./validationErrors.js";
import { verifyIsBibliotecary } from "./userMiddlewares.js";

export const verificarQuejaOSugerencia = (req,res,next) => {
    const { type } = req.body;

    const typePermited = ['queja','sugerencia'];

    if (typePermited.includes(type)) return next();

    return res.status(400).json({
        success:false,
        status: 400,
        message: `(${type}) no esta permitido. Por favor introduzca (queja o sugerencia)`
    });
}


export const  validationUpdateQuejasSugerencias = [
    check('newState','Es necesario que el estado de la (queja o sugerencia) sea proporcionado').notEmpty(),
    check('newState','El estado tiene que ser de tipo String').isString(),
    verifyIsBibliotecary,
    validationsErrors,
]


export const validationInsertQuejasSugerencias = [
    check('type','El tipo es obligatorio').notEmpty(),
    check('type','El tipo tiene que ser de tipo string').isString(),
    check('content','El contenido es obligatorio').notEmpty(),
    check('content','El contenido es de tipo string').isString(),
    validationsErrors,
    verificarQuejaOSugerencia,
]