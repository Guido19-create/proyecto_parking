export class UserController {
    constructor (userService) {
        this.userService = userService;
    }

    async getUserAllController (req,res) {
        const response = await this.userService.getUserAllService(req);
        return res.status(response.status).json(response);
    }

    async getUserForSolapinController (req,res) {
        const response = await this.userService.getUserForSolapinService(req);
        return res.status(response.status).json(response);
    }

}