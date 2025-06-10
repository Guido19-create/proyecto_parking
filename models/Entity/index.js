import { sequelize } from '../../config/databaseConection.js';

// Importar todos los modelos
import { Usuarios, configurarRelacionesUsuarios } from './Usuario.js';
import { Documentos,  configurarRelacionesDocumentos } from './Documentos.js';
import { Prestamos,  configurarRelacionesPrestamos } from './Prestamos.js';
import { Solicitudes, configurarRelacionesSolicitudes } from './Solicitudes.js';
import { Devoluciones,  configurarRelacionesDevoluciones } from './Devoluciones.js';
import { QuejasSugerencias, configurarRelacionesQuejas } from './QuejasSugerencias.js';

// Objeto con todos los modelos para fácil acceso
const modelos = {
  Usuarios,
  Documentos,
  Prestamos,
  Solicitudes,
  Devoluciones,
  QuejasSugerencias
};

// Función principal para inicializar todo
export async function inicializarModelos() {
  try {
    // 1. Autenticar conexión a la base de datos
    await sequelize.authenticate();
    console.log('✅ Conexión a BD establecida');

    // 2. Configurar todas las relaciones
    await configurarRelacionesUsuarios();
    await configurarRelacionesDocumentos();
    await configurarRelacionesPrestamos();
    await configurarRelacionesSolicitudes();
    await configurarRelacionesDevoluciones();
    await configurarRelacionesQuejas();
    
    console.log('✅ Todas las relaciones configuradas');
    
     // 3. Sincronizar modelos con la base de datos (solo en desarrollo)
    /*if (process.env.NODE_ENV !== 'production') {
      await sequelize.sync({ alter: true });
      console.log('✅ Modelos sincronizados (alter)');
    }*/

    return modelos;
  } catch (error) {
    console.error('❌ Error al inicializar modelos:', error);
    throw error;
  }
}

// Exportar los modelos por si se necesitan individualmente
export default modelos;