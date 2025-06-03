import { DataTypes } from 'sequelize';
import { sequelize } from '../../config/databaseConection.js';

// 1. Primero definimos el modelo base
export const Solicitudes = sequelize.define('Solicitudes', {
  id_solicitudes: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    comment: 'Identificador único de la solicitud'
  },
  codigo: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
    comment: 'Código único de referencia de la solicitud'
  },
  estadoSolicitud: {
    type: DataTypes.ENUM('perfecto', 'dañado', 'perdido'),
    allowNull: false,
    defaultValue: 'perfecto',
    comment: 'Estado físico del material solicitado'
  },
  fechaSolicitud: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    comment: 'Fecha en que se realizó la solicitud'
  }
}, {
  tableName: 'solicitudes',
  timestamps: true,
  comment: 'Tabla para gestionar las solicitudes de materiales'
});

// 2. Función para configurar relaciones (se llama después de inicializar todos los modelos)
export async function configurarRelacionesSolicitudes() {
  // Importación dinámica de los modelos relacionados
  const { Usuarios } = await import('./Usuario.js');
  const { Documentos } = await import('./Documentos.js');
  const { Prestamos } = await import('./Prestamos.js');
  
  // Relación con Usuarios (quien hace la solicitud)
  Solicitudes.belongsTo(Usuarios, {
    foreignKey: {
      name: 'usuarioSolapin',
      allowNull: false
    },
    targetKey: 'solapin',
    as: 'solicitante',
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE'
  });

  // Relación con Documentos (material solicitado)
  Solicitudes.belongsTo(Documentos, {
    foreignKey: {
      name: 'documentoId',
      allowNull: false
    },
    targetKey: 'id_documento',
    as: 'documento',
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE'
  });

  // Relación con Préstamos (si se convierte en préstamo)
  Solicitudes.hasOne(Prestamos, {
    foreignKey: {
      name: 'solicitudId',
      allowNull: true
    },
    sourceKey: 'id_solicitudes',
    as: 'prestamo',
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE'
  });
}