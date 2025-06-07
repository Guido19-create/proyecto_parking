import { Router } from "express";
import { DocumentController } from "../controllers/document.controllers.js";
import { DocumentService } from "../services/document.service.js";
import { documentVerify, updateValidations } from "../middlewares/documentMiddlewares.js";
import { verifyIsBibliotecary } from "../middlewares/userMiddlewares.js";

export const createDocumentRoutes = () => {
    const router = Router();

    const documentService = new DocumentService()
    const documentController = new DocumentController( documentService );

    //Insertar un documento
    router.post('/',documentVerify,(req,res)=> documentController.createDocumentController(req,res));

    //Obtener todos los documentos de forma paginada
    router.get('/',(req,res)=> documentController.getDocumentsPaginatedController(req,res));

    //Actualizar un documento
    router.put('/:nameDocument',updateValidations,(req,res)=> documentController.updateDocumentController(req,res));

    //Eliminar un documento
    router.delete('/',verifyIsBibliotecary,(req,res)=> documentController.deleteDocumentController(req,res));
    
    //Buscar elemento especifico
    router.get('/:nameDocument',(req,res)=> documentController.searchDocumentForNameController(req,res));

    //Obtener tipos de documentos 
    router.get('/type/get',(req,res)=> documentController.getTypeDocumentController(req,res));

    
    return router;
}
