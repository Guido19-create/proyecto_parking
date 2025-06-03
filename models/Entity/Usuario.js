import { DataTypes } from 'sequelize';
import { sequelize } from '../../config/databaseConection.js';

// 1. Primero definimos el modelo
export const Usuarios = sequelize.define('Usuarios', {
  solapin: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  esBibliotecario: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  }
}, {
  tableName: 'usuarios',
  timestamps: true
});

// 2. Función asíncrona para configurar relaciones
export async function configurarRelacionesUsuarios() {
  // Importación dinámica de los modelos necesarios
  const { Prestamos } = await import('./Prestamos.js');
  const { QuejasSugerencias } = await import('./QuejasSugerencias.js');
  const { Solicitudes } = await import('./Solicitudes.js');
  
  Usuarios.hasMany(Prestamos, {
    foreignKey: 'usuarioSolapin',
    sourceKey: 'solapin'
  });

  Usuarios.hasMany(QuejasSugerencias, {
    foreignKey: 'usuarioSolapin',
    sourceKey: 'solapin'
  });

  Usuarios.hasMany(Solicitudes, {
    foreignKey: 'usuarioSolapin',
    sourceKey: 'solapin'
  });
}
