import { Op } from "sequelize";
import { Documentos } from "../models/Entity/Documentos.js";
import { eliminarArchivo, subirArchivo } from "../utils/cargarArchivo.js";
import { createToken } from "../utils/generateJWT.js";
import { mapearRequest } from "../utils/mapearRequest.js";

export class DocumentService {
  async createDocumentService(data) {
    try {
      const {
        typeDocument,
        category,
        author,
        nameDocument,
        quantity,
        stateDocument,
        location,
      } = data.body;

      let photoURL =
        "https://res.cloudinary.com/dypatsbqk/image/upload/v1749138824/Documentos/sktwzfoehov5csheg08j.jpg";

      // Si existen archivos, subimos el documento
      if (data.files && data.files.photoDocument) {
        photoURL = await subirArchivo(
          data.files.photoDocument.tempFilePath,
          "Documentos"
        );
      }

      // Creamos el documento en la base de datos
      const document = await Documentos.create({
        tipoDeDocumento: typeDocument,
        genero: category,
        autor: author,
        fotoDelDocumento: photoURL, // Usará la URL o la url por defecto
        nombreDocumento: nameDocument,
        cantidadDisponible: quantity,
        estadoDelDocumento: stateDocument,
        ubicacion: location,
      });

      return {
        token: createToken(data.solapin),
        message: "Documento creado exitosamente",
        success: true,
        status: 201,
        document,
      };
    } catch (error) {
      console.error("Error en createDocumentService:", error);
      return {
        message: "No se pudo crear el documento",
        success: false,
        status: 500,
        error: error.message,
      };
    }
  }

  async getDocumentsPaginatedService(data) {
    try {
      let { page = 1, limit = 10 } = data.query;

      // Validación
      page = parseInt(page);
      limit = parseInt(limit);
      if (isNaN(page) || page < 1) page = 1;
      if (isNaN(limit) || limit < 1 || limit > 100) limit = 10; // Máximo 100 items

      const offset = (page - 1) * limit;

      const { count, rows } = await Documentos.findAndCountAll({
        limit: limit,
        offset: offset,
      });

      if (count === 0)
        return {
          success: false,
          message: `No se encontro ningun documento`,
        };

      const totalPages = Math.ceil(count / limit);

      return {
        token: createToken(data.solapin),
        success: true,
        status: 200,
        message: "Resultados Obtenidos ...",
        totalPages,
        results: rows,
      };
    } catch (error) {
      console.log(error.message);
      throw new Error(
        "Ha ocurrido un error en el servidor no se pudo obtener los documentos"
      );
    }
  }

  async deleteDocumentService(data) {
    const { nameDocument } = data.body;

    try {
      // 1. Buscar el documento
      const document = await Documentos.findOne({
        where: { nombreDocumento: nameDocument },
      });

      if (!document) {
        return {
          success: false,
          status: 404, // Not Found
          message: `El documento "${nameDocument}" no existe`,
        };
      }

      // 2. Eliminar el documento (físicamente)
      const result = await document.destroy({ force: true });

      // 3. Verificación adicional (opcional pero recomendada)
      const documentoEliminado = await Documentos.findOne({
        where: { nombreDocumento: nameDocument },
        paranoid: false, // Busca incluso los borrados lógicamente
      });

      if (documentoEliminado) {
        console.error(
          `El documento "${nameDocument}" no se eliminó físicamente`
        );
        return {
          success: false,
          status: 500,
          message: `Error interno: No se pudo eliminar "${nameDocument}" completamente`,
        };
      }

      // 4. Respuesta exitosa
      return {
        success: true,
        status: 200,
        message: `"${nameDocument}" ha sido eliminado permanentemente`,
        token: createToken(data.solapin),
      };
    } catch (error) {
      console.error(`Error al eliminar "${nameDocument}":`, error.message);
      return {
        success: false,
        status: 500,
        message: `Error interno al intentar eliminar "${nameDocument}"`,
        errorDetails:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      };
    }
  }

  async searchDocumentForNameService(data) {
    const { nameDocument } = data.params;
    const { limit = 10, page = 1 } = data.query;

    // Asegurarnos que limit y page sean números enteros
    const parsedLimit = parseInt(limit, 10);
    const parsedPage = parseInt(page);
    const offset = (page - 1) * limit;

    try {
      const { count, rows } = await Documentos.findAndCountAll({
        where: {
          nombreDocumento: {
            [Op.regexp]: nameDocument,
          },
        },
        limit: parsedLimit,
        offset: offset,
      });

      if (count === 0)
        return {
          success: false,
          status: 404,
          message: `No se encontraron resultados de "${nameDocument}"`,
        };

      return {
        success: true,
        status: 200,
        message: `Resultados obtenidos de "${nameDocument}"`,
        results: rows,
        totalPages: Math.ceil(count / parsedLimit),
        pageActual: parsedPage,
      };
    } catch (error) {
      console.error(error.message);
      return {
        success: false,
        status: 500,
        message: `Error interno al intentar buscar "${nameDocument}"`,
        errorDetails:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      };
    }
  }

  async updateDocumentService(data) {
    const { nameDocument } = data.params;
    console.log(nameDocument);
    const updateData = data.body;
    const newImageFile = data.files.photoDocument; // Asumiendo que usas multer o similar para subir archivos

    try {
      // 1. Buscar el documento existente
      const document = await Documentos.findOne({
        where: { nombreDocumento: nameDocument },
      });

      if (!document) {
        return {
          success: false,
          status: 404,
          message: `Documento  ${nameDocument} no fue encontrado`,
        };
      }

      // 2. Manejo de la imagen si se está actualizando
      if (newImageFile) {
        try {
          // Eliminar la imagen anterior si existe
          if (document.fotoDelDocumento) {
            await eliminarArchivo(document.fotoDelDocumento, "Documentos"); // Tu función para eliminar de Cloudinary
          }

          // Subir la nueva imagen
          const uploadResult = await subirArchivo(
            newImageFile.tempFilePath,
            "Documentos"
          );
          updateData.fotoDelDocumento = uploadResult; // Asignar nueva URL
        } catch (error) {
          console.error("Error al manejar imágenes:", error);
          return {
            success: false,
            status: 500,
            message: "Error al procesar la imagen",
            errorDetails:
              process.env.NODE_ENV === "development"
                ? error.message
                : undefined,
          };
        }
      }

      console.log(updateData);
      const dataMapeada = mapearRequest(updateData);
      // 3. Actualizar el documento en la base de datos
      const [updatedRows] = await Documentos.update(dataMapeada, {
        where: { nombreDocumento: nameDocument },
      });
      console.log(updatedRows);

      if (updatedRows === 0) {
        return {
          success: false,
          status: 400,
          message: "No se realizaron cambios en el documento",
        };
      }

      // 4. Obtener y devolver el documento actualizado
      const updatedDocument = await Documentos.findByPk(document.id_documento);

      return {
        success: true,
        status: 200,
        message: "Documento actualizado correctamente",
        document: updatedDocument,
      };
    } catch (error) {
      console.error("Error al actualizar documento:", error);
      return {
        success: false,
        status: 500,
        message: "Error interno al actualizar el documento",
        errorDetails:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      };
    }
  }

  async getTypeDocumentService() {
    try {
      const documents = await Documentos.findAll({
        attributes: ["tipoDeDocumento"],
      });

      if (documents.length === 0) return {
        success: false,
        status: 404,
        message: `No hay documentos`
      };

      return {
        success: true,
        status: 200,
        message: `Tipos de documnetos obtenidos`,
        results: documents,
      };
    } catch (error) {
      console.error(error);
      return {
        success: false,
        status: 500,
        message: "Ha ocurrido un error en el servidor,No se pudo obtener los tipos de documentos", 
        errorDetails:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      };
    }
  }
}
