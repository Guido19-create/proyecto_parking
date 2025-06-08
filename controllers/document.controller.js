export class DocumentController {
  constructor(documentService) {
    this.documentService = documentService;
  }

  async createDocumentController(req, res) {
    const response = await this.documentService.createDocumentService(req);

    return response.success
      ? res.status(201).json(response)
      : res.status(500).json(response);
  }

  async getDocumentsPaginatedController(req, res) {
    try {
      const response = await this.documentService.getDocumentsPaginatedService(
        req
      );
      return response.success
        ? res.status(200).json(response)
        : res.status(404).json(response);
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  async deleteDocumentController(req, res) {
    try {
      const response = await this.documentService.deleteDocumentService(req);

      return res.status(response.status || 500).json({
        success: response.success,
        message: response.message,
        token: response.token,
      });
    } catch (error) {
      console.error("Error en el controlador:", error);
      return res.status(500).json({
        success: false,
        message: "Error interno del servidor",
      });
    }
  }

  async searchDocumentForNameController(req, res) {
    const response = await this.documentService.searchDocumentForNameService(req);
    return res.status(response.status).json(response);
  }

  async updateDocumentController(req, res) {
    const response = await this.documentService.updateDocumentService(req);
    return res.status(response.status).json(response);
  }

  async getTypeDocumentController (req, res) {
    const response = await this.documentService.getTypeDocumentService();
    return res.status(response.status).json(response);
  }

}
