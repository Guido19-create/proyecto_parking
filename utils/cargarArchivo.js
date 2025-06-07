import cloudinary from "cloudinary";
import dotenv from "dotenv";
import { obtenerNombreURL } from "./obtenerNombreImagen.js";
import { globalEnv } from "../config/configEnv.js";

cloudinary.v2.config({
  cloud_name: globalEnv.CLOUD_NAME,
  api_key: globalEnv.API_KEY,
  api_secret: globalEnv.API_SECRET,
});

export const subirArchivo = (rutaArchivo,carpeta) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Subir la imagen a la carpeta "fotoPerfil"
      const resultado = await cloudinary.v2.uploader.upload(rutaArchivo, {
        folder: carpeta, // Carpeta de fotos de perfil
      });

      resolve(resultado.secure_url);
    } catch (err) {
      reject(err);
    }
  });
};


export const eliminarArchivo = (photoURL,carpeta) => {

  return new Promise(async (resolve,reject) => {
    try{
      const nombreID = obtenerNombreURL(photoURL);
      await cloudinary.uploader.destroy(`${carpeta}/${nombreID}`);
      resolve('Archivo Eliminado')
    } catch (err) {
      reject(err);
    }
  });

}





