import { obtenerExtensionURL } from "../utils/obtenerNombreImagen.js";

export const validarExtensionesPermitidas = (extensiones) => {
  return (req, res, next) => {
    // Si no hay archivos o no hay campo 'imagen', omitir el middleware
    if (!req.files || !req.files.imagen) {
      return next();
    }

    // Convertir a un arreglo si no lo es
    const imagen = Array.isArray(req.files.imagen)
      ? req.files.imagen
      : [req.files.imagen];

    // Validar la extensión de cada archivo
    for (let i of imagen) {
      let extension = obtenerExtensionURL(i.name);

      if (!extensiones.includes(extension)) {
        return res
          .status(400)
          .json({ msg: `El archivo ${i.name} no tiene una extensión válida: ${extensiones.join(', ')}` });
      }
    }

    // Si pasa la validación, continuar con el siguiente middleware
    return next();
  };
};
