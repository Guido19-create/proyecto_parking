export class PrestamoController {
  constructor(prestamoService) {
    this.prestamoService = prestamoService;
  }

  async createPrestamoController(req, res) {
    const response = await this.prestamoService.createPrestamoService(req);
    return res.status(response.status).json(response);
  }

  async getPrestamosController(req,res) {
    const response = await this.prestamoService.getPrestamosService(req);
    return res.status(response.status).json(response);
  }

  async updatePrestamoController(req,res) {
    const response = await this.prestamoService.updatePrestamoService(req);
    return res.status(response.status).json(response);
  }

  async deletePrestamoController (req,res) {
    const response = await this.prestamoService.deletePrestamoService(req);
    return res.status(response.status).json(response);
  }

}
