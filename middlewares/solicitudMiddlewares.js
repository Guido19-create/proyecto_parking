import { check } from "express-validator";
import { validationsErrors } from "./validationErrors.js";
import { Solicitudes } from "../models/Entity/Solicitudes.js";
import { Usuarios } from "../models/Entity/Usuario.js";

export const verifyMaxSolicitudes = (maxSolicitudes) => {
  return async (req, res, next) => {
    try {
      const { count } = await Solicitudes.findAndCountAll({
        where: { usuarioSolapin: req.solapin },
      });
      if (count === maxSolicitudes)
        return res.status(400).json({
          success: false,
          status: 400,
          message:
            "No puede encargar mas libro por hoy. Ha alcanzado el maximo de solicitudes",
        });
    } catch (error) {
      console.error("Error al verificar solicitud:", error);
      return {
        success: false,
        status: 500,
        message: "Error al verificar la solicitud",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      };
    }

    return next();
  };
};


export const verificarSiPuedeCancelarSolicitud = async (req, res, next) => {
  const solapin = req.solapin;
  const { code } = req.params;

  try {
    const solicitud = await Solicitudes.findOne({
      where: { codigo: code },
      include: {
        model: Usuarios,
        as: "solicitante",
        attributes: ["solapin", "esBibliotecario"],
      },
    });

    if (!solicitud)
      return res.status(400).json({
        success: false,
        status: 400,
        message: `Esta solicitud ${code} no ha sido encontrda`,
      });

    if (solicitud.solicitante.solapin === solapin) return next();

    if (solicitud.solicitante.esBibliotecario) return next();

    return res.status(403).json({
      success:false,
      status:403,
      message:"Usted no tiene acceso para cancelar esta solicitud"
    });
  } catch (error) {
    console.error("Error al buscar solicitud:", error);
    return {
      success: false,
      status: 500,
      message: "Error al buscar la solicitud",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    };
  }
};

export const validationsCreateSolicitud = [
  verifyMaxSolicitudes(5),
  check(
    "documentId",
    "El id del documento tiene que ser obligatoria"
  ).notEmpty(),
  check("documentId", "EL id del documento tiene que ser de tipo Int").isInt(),
  validationsErrors,
];
