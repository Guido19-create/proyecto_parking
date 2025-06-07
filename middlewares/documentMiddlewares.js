import { check } from "express-validator";
import { validationsErrors } from "./validationErrors.js";
import { Documentos } from "../models/Entity/Documentos.js";
import { cantidadArchivosPermitidos, verificarCargaDeArchivo } from "./verificacionArchivo.js";
import { validarExtensionesPermitidas } from "./validarExtensiones.js";
import { verifyIsBibliotecary } from "./userMiddlewares.js";


export const verifyDocumentUnique = async(req, res, next) => {
    try {
        // Verificar si existe nameDocument en el body
        if (!req.body || !req.body.nameDocument) {
            return next(); // Si no viene, continuamos sin verificar
        }
        
        const { nameDocument } = req.body;
        
        // Validar que nameDocument no esté vacío
        if (typeof nameDocument !== 'string' || nameDocument.trim() === '') {
            return res.status(400).json({
                success: false,
                message: 'El nombre del documento no puede estar vacío'
            });
        }

        const document = await Documentos.findOne({ 
            where: { nombreDocumento: nameDocument.trim() } 
        });

        if (document) {
            return res.status(400).json({
                success: false,
                message: 'No se pudo añadir este documento porque ya existe. Para modificarlo, use la opción de editar.'
            });
        }
        
        return next();
        
    } catch (error) {
        console.error('Error en verifyDocumentUnique:', error);
        return res.status(500).json({
            success: false,
            message: 'Error al verificar la unicidad del documento',
            errorDetails: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

export const verifyStateDocument = (req, res, next) => {
    if (!req.body || !req.body.stateDocument) {
        return next(); // Si no viene, continuamos sin verificar
    }
    const permittedDocuments = ['perfecto', 'dañado', 'en reparación', 'perdido'];

    const { stateDocument } = req.body;

    if (permittedDocuments.includes(stateDocument)) return next();

    return res.status(400).json({
        message :'Estado del documento no permitido -> perfecto | dañado | en reparacion | perdido',
        success:false
    });
    

}

//Validaciones de la ruta para atualizar
export const updateValidations  = [
    verifyIsBibliotecary,   
    cantidadArchivosPermitidos(1),
    validarExtensionesPermitidas(['jpg','png','jpeg']),
    check('typeDocument','El tipo de documento es obligatorio').optional().notEmpty(),
    check('typeDocument','El tipo de documento tiene que ser un string').optional().isString(),
    check('category','La categoria es obligatoria').optional().notEmpty(),
    check('category','La categoria tiene que ser un string').optional().isString(),
    check('author','El autor es obligatorio').optional().notEmpty(),
    check('author','El autor tiene que ser de tipo string').optional().isString(),
    check('nameDocument','El nombre del documento es obligatorio').optional().notEmpty(),
    check('nameDocument','El nombre del documento tiene que ser un String').optional().isString(),
    check('quantity','La cantidad disponible del documento es obligatorio').optional().notEmpty(),
    check('quantity','La cantidad disponible tiene que ser un entero').optional().isInt(),
    check('stateDocument','El estado del documento es obligatorio').optional().notEmpty(),
    check('stateDocument','El estado del documento tiene que ser string').optional().isString(),
    check('location','La ubicacion del documento es obligatoria').optional().notEmpty(),
    check('location','La ubicacion del documento tiene que ser un string').optional().isString(),
    validationsErrors,
    verifyDocumentUnique,
    verifyStateDocument
]




export const documentVerify = [
    verifyIsBibliotecary,   
    cantidadArchivosPermitidos(1),
    validarExtensionesPermitidas(['jpg','png','jpeg']),
    check('typeDocument','El tipo de documento es obligatorio').notEmpty(),
    check('typeDocument','El tipo de documento tiene que ser un string').isString(),
    check('category','La categoria es obligatoria').notEmpty(),
    check('category','La categoria tiene que ser un string').isString(),
    check('author','El autor es obligatorio').notEmpty(),
    check('author','El autor tiene que ser de tipo string').isString(),
    check('nameDocument','El nombre del documento es obligatorio').notEmpty(),
    check('nameDocument','El nombre del documento tiene que ser un String').isString(),
    check('quantity','La cantidad disponible del documento es obligatorio').notEmpty(),
    check('quantity','La cantidad disponible tiene que ser un entero').isInt(),
    check('stateDocument','El estado del documento es obligatorio').notEmpty(),
    check('stateDocument','El estado del documento tiene que ser string').isString(),
    check('location','La ubicacion del documento es obligatoria').notEmpty(),
    check('location','La ubicacion del documento tiene que ser un string').isString(),
    validationsErrors,
    verifyDocumentUnique,
    verifyStateDocument
]