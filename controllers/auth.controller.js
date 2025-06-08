export class AuthControllers {
  constructor(authService) {
    this.authService = authService;
  }

  //Controlador de registrarse
  async registerControllers(req, res) {
    console.log(req.body)
    const response = await this.authService.registerService(req.body);

    return response.success ? res.status(201).json(response) : res.status(500).json(response);
  }

  //Controlador de logearse
  async loginControllers(req, res) {
    try {
      const response = await this.authService.loginService(req.body);

      console.log(response)
      return response.success 
      ? res.status(200).json(response) 
      : res.status(401).json(response);

    } catch (error) {
      return res.status(500).json(error);
    }
  }
}