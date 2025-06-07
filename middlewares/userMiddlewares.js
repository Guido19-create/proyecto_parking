import { Usuarios } from "../models/Entity/Usuario.js"

export const verifyIsBibliotecary = async (req,res,next) => {
    try {
        const bibliotecary = await Usuarios.findByPk(req.solapin);
    
        return bibliotecary.esBibliotecario ? next() : res.status(403).json({
            success:false,
            status: 403,
            message:'Este usuario no esta autorizado para realizar esta accion'
        });
    } catch (error) {
        return res.status(500).json({
            success:false,
            status: 500,
            message:'Error server.Vuelva a intentar'
        });
    }
}