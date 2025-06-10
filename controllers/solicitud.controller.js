
export class SolicitudController {
    constructor (solicitudService) {
        this.solicitudService = solicitudService;
    }

    async createSolicitudController (req,res) {
        const response = await this.solicitudService.createSolicitudService(req);
        return res.status(response.status).json(response);
    }
    async searchSolicitudForCodeController (req,res) {
        const response = await this.solicitudService.searchSolicitudForCodeService(req);
        return res.status(response.status).json(response);
    }

    async getSolicitudesALLController (req,res) {
        const response = await this.solicitudService.getSolicitudesALLService(req);
        return res.status(response.status).json(response);
    }

    async cancelSolicitudController(req,res) {
        const response = await this.solicitudService.cancelSolicitudService(req);
        return res.status(response.status).json(response);
    }
}