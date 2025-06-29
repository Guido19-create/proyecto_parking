import { Usuarios } from "../models/Entity/Usuario.js";
import { createToken } from "../utils/generateJWT.js";
import { hashPassword, verifyPassword } from "../utils/hashearPassword.js";

export class AuthService {
  async registerService(data) {
    try {
      const { solapin, nombre, password} = data;

      const hashPass =  hashPassword(password);
      
      const user = Usuarios.build({
        solapin,
        nombre,
        password: hashPass,
        esBibliotecario:false,
      });

      await user.save();

      const esBibliotecario = user.esBibliotecario;

      return {
        solapin,
        nombre,
        esBibliotecario,
        success: true,
        result: user,
        message: "Usuario regristrado exitosamente",
      };
    } catch (error) {
      console.log(error);
      return {
        success: false,
        message: "No se ha podido registar al usuario",
        error: error.message,
      };
    }
  }

  async loginService(data) {
    const { solapin, password } = data;
    try {
      const user = await Usuarios.findByPk(solapin);

      if (!user)
        return {
          success: false,
          message: "Solapin o contraseña incorrecta",
        };

      // Verificar si el usuario existe y tiene contraseña
      return verifyPassword(password, user.password)
        ? {
            message: "Usuario logeado",
            success: true,
            result: user,
            token: createToken(user.solapin),
          }
        : {
            success: false,
            message: "Solapin o contraseña incorrecta",
          };
    } catch (error) {
      console.log(`Error en el logeo: ${error}`);
      throw new Error(
        `Ha ocurrido un error en el sevidor en el login : ${error}`
      );
    }
  }
}
