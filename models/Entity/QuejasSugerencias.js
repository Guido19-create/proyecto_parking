import { DataTypes } from 'sequelize';
import { sequelize } from '../../config/databaseConection.js';

// 1. Definición del modelo base
export const QuejasSugerencias = sequelize.define('QuejasSugerencias', {
  id_queja_sugerencia: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    comment: 'ID único de la queja/sugerencia'
  },
  tipo: {
    type: DataTypes.ENUM('queja', 'sugerencia'),
    allowNull: false,
    comment: 'Tipo de registro (queja o sugerencia)'
  },
  contenido: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'El contenido no puede estar vacío'
      },
      len: {
        args: [10, 2000],
        msg: 'El contenido debe tener entre 10 y 2000 caracteres'
      }
    },
    comment: 'Texto detallado de la queja o sugerencia'
  },
  estado: {
    type: DataTypes.ENUM('pendiente', 'revisado', 'resuelto'),
    defaultValue: 'pendiente',
    allowNull: false,
    comment: 'Estado de gestión de la queja/sugerencia'
  },
  fecha_creacion: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    comment: 'Fecha de creación del registro'
  }
}, {
  tableName: 'quejassugerencias',
  timestamps: true,
  comment: 'Registro de quejas y sugerencias de usuarios'
});

// 2. Función para configurar relaciones
export async function configurarRelacionesQuejas() {
  // Importación dinámica del modelo Usuarios
  const { Usuarios } = await import('./Usuario.js');
  
  // Relación con Usuarios (quien realiza la queja/sugerencia)
  QuejasSugerencias.belongsTo(Usuarios, {
    foreignKey: {
      name: 'usuarioSolapin',
      allowNull: false
    },
    targetKey: 'solapin',
    as: 'usuario',
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE'
  });
}