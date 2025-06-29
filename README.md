# 🚗 Parking API 

API para gestión de estacionamientos. Registra vehículos, gestiona espacios y administra tarifas programáticamente.

![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js)
![Express](https://img.shields.io/badge/Express-4.x-000000?logo=express)
![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?logo=mysql&logoColor=white)

## 📦 Instalación

### Requisitos
- Node.js 18+
- npm 9+ o yarn
- MySQL

```bash
# 1. Clonar repositorio
git clone https://github.com/Guido19-create/proyecto_parking.git
cd proyecto_parking

# 2. Instalar dependencias
npm install

# 3. Configurar entorno
# Editar .env con tus credenciales
PORT=3000
DB_NAME=parkingdb(Nombre de la base de datos)
DB_PORT=3306
DB_USERNAME=usuario correspondiente de la base de datos
DB_PASSWORD=contraseña de la conexion a la base de datos
DB_HOST=host de la base de datos
KEY_JWT=clase_secreta

# 4. Iniciar servidor
npm run dev
