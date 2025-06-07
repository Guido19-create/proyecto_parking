export const verificarCargaDeArchivo = (req, res, next) => {
  if (!req.files || Object.keys(req.files) === 0) {
    return res.status(400).json({ msg: "No se ha subido ningun archivo" });
  }
  next();
};

export const cantidadArchivosPermitidos = (numeroArchivosPermitidos) => {
  return (req, res, next) => {
    // Si no hay archivos o no hay campo 'imagen', omitir el middleware
    if (!req.files || !req.files.imagen) {
      return next();
    }

    if (Object.keys(req.files).length <= numeroArchivosPermitidos) {
      return next();
    }

    return res.status(400).json({
      msg: `No se pueden subir mas de ${numeroArchivosPermitidos} archivos`,
    });
  };
};
