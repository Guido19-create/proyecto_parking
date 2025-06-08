export class QuejasSugerenciasController {
  constructor(quejasSugerenciasService) {
    this.quejasSugerenciasService = quejasSugerenciasService;
  }

  async addQuejasSugerenciasController(req, res) {
    const response = await this.quejasSugerenciasService.addQuejasSugerenciasService(req);
    return res.status(response.status).json(response);
  }

  async getQuejasSugerenciasController(req, res) {
    const response = await this.quejasSugerenciasService.getQuejasSugerenciasService(req);
    return res.status(response.status).json(response);
  }

  async deleteQuejasSugerenciasController(req,res) {
    const response = await this.quejasSugerenciasService.deleteQuejasSugerenciasService(req);
    return res.status(response.status).json(response);
  }

  async setStateQuejasSugerenciasController(req,res) {
    const response = await this.quejasSugerenciasService.setStateQuejasSugerenciasService(req);
    return res.status(response.status).json(response);
  }
}
