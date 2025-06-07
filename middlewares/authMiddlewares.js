import { Usuarios } from "../models/Entity/Usuario.js"
import { check } from "express-validator";
import { validationsErrors } from "./validationErrors.js";
import jwt from 'jsonwebtoken';
import { globalEnv } from "../config/configEnv.js";

export const verifyUserSolapin = async (req, res, next) => {
    const user = await  Usuarios.findByPk(req.body.solapin);

    if ( !user ) return next()
        console.log(user)

    return res.status(409).json({
        success: false,
        message: 'Este solapin ya esta regitrado.'
    });
}

export const verifyUser = async (req, res, next) => {
    const user = await Usuarios.findOne({where: { nombre: req.body.nombre}});

    if ( !user ) return next()

    return res.status(409).json({
        success: false,
        message: 'Este nombre ya esta regitrado.'
    });
}

export const verifyToken = ( req, res, next ) => {
    try {
        const token = req.header('token');
        const payload = jwt.verify(token,globalEnv.KEY_JWT);
        req.solapin = payload.solapin;
        return next()
    } catch (error) {
        return res.status(403).json({
            success:false,
            message: 'No hay token en la peticion'
        })
    }
}


export const validationRegister = [
    check('solapin','El solapin es obligatorio').notEmpty(),
    check('solapin','El solapin tiene que ser de tipo string').isString(),
    check('nombre','El nombre es obligatorio').notEmpty(),
    check('nombre','El nombre tiene que ser un string').isString(),
    check('password','La contraseña es obligatoria').notEmpty(),
    check('password','La contraseña tiene que ser un string').isString(),
    validationsErrors,
    verifyUserSolapin,
    verifyUser
];


export const validationLogin = [
    check('solapin','El solapin es obligatorio').notEmpty(),
    check('solapin','El solapin tiene que ser de tipo string').isString(),
    check('password','La contraseña es obligatoria').notEmpty(),
    check('password','La contraseña tiene que ser un string').isString(),
    validationsErrors
]
