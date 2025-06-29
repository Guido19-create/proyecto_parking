import express from "express";
import { createRoutes } from "../../routes/index.js";
import { inicializarModelos } from "../Entity/index.js";
import fileUpload from "express-fileupload";
import { deleteSolicitudesExpiradas } from "../../utils/deleteSolicitudesExpiradas.js";
import cors from 'cors';
export class ServerClass {
  constructor() {
    this.app = express();
    this.port = process.env.PORT || 3000;
    this.ConfigureMiddleware();
    this.ConfigureRoutes();
    this.initDB();
    deleteSolicitudesExpiradas(); 
  }

  ConfigureMiddleware() {
    this.app.use(express.json()); // Para parsear JSON en las requests
    this.app.use(
      fileUpload({
        createParentPath: true,
        useTempFiles: true,
        tempFileDir: "/temp/",
      })
    );
    this.app.use(cors({
      origin:'http://127.0.0.1:5500',
      methods:['GET','POST','PUT','DELETE'],
      allowedHeaders:['Content-Type','Authorization','token']
    }));
  }

  ConfigureRoutes() {
    this.app.use("/api", createRoutes()); // Monta las rutas bajo /api
  }

  initDB() {
    inicializarModelos();
  }

  start() {
    this.app.listen(this.port, () => {
      console.log(`Servidor corriendo en http://localhost:${this.port}`);
    });
  }
}
