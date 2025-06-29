export class DevolucionController {
  constructor(devolucionService) {
    this.devolucionService = devolucionService;
  }

  async createDevolucionController(req, res) {
    const response = await this.devolucionService.createDevolucionService(req);
    return res.status(response.status).json(response);
  }

  async getDevolucionesAllController(req,res) {
    const response = await this.devolucionService.getDevolucionesAllService(req);
    return res.status(response.status).json(response);
  }
}
