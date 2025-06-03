import { DataTypes } from 'sequelize';
import { sequelize } from '../../config/databaseConection.js';

// 1. Definición del modelo base
export const Prestamos = sequelize.define('Prestamos', {
  id_prestamos: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    comment: 'ID único del préstamo'
  },
  fechaDelPrestamo: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    comment: 'Fecha cuando se realiza el préstamo',
    validate: {
      isDate: {
        msg: 'La fecha del préstamo debe ser válida'
      },
      isBefore: {
        args: [new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)], // Máximo 1 año en el futuro
        msg: 'La fecha no puede ser más de un año en el futuro'
      }
    }
  },
  fechaDeEntrega: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    comment: 'Fecha límite de devolución',
    validate: {
      isDate: true,
      isAfter: {
        args: [new Date()],
        msg: 'La fecha de entrega debe ser posterior a hoy'
      }
    }
  },
  estado: {
    type: DataTypes.ENUM('activo', 'vencido', 'completado', 'cancelado'),
    defaultValue: 'activo',
    allowNull: false,
    comment: 'Estado actual del préstamo'
  }
}, {
  tableName: 'prestamos',
  timestamps: true,
  comment: 'Registro de préstamos de documentos a usuarios',
  indexes: [
    {
      fields: ['usuarioSolapin'],
      name: 'idx_prestamos_usuario'
    },
    {
      fields: ['documentoId'],
      name: 'idx_prestamos_documento'
    }
  ]
});

// 2. Función para configurar relaciones
export async function configurarRelacionesPrestamos() {
  // Importación dinámica de modelos relacionados
  const { Usuarios } = await import('./Usuario.js');
  const { Documentos } = await import('./Documentos.js');
  const { Solicitudes } = await import('./Solicitudes.js');
  const { Devoluciones } = await import('./Devoluciones.js');
  
  // Relación con Usuario (quien recibe el préstamo)
  Prestamos.belongsTo(Usuarios, {
    foreignKey: {
      name: 'usuarioSolapin',
      allowNull: false
    },
    targetKey: 'solapin',
    as: 'usuario',
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE'
  });

  // Relación con Documento (material prestado)
  Prestamos.belongsTo(Documentos, {
    foreignKey: {
      name: 'documentoId',
      allowNull: false
    },
    targetKey: 'id_documento',
    as: 'documento',
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE'
  });

  // Relación con Solicitud (origen del préstamo)
  Prestamos.hasOne(Solicitudes, {
    foreignKey: {
      name: 'prestamoId',
      allowNull: true
    },
    sourceKey: 'id_prestamos',
    as: 'solicitud',
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE'
  });

  // Relación con Devolución (cierre del préstamo)
  Prestamos.hasOne(Devoluciones, {
    foreignKey: {
      name: 'prestamoId',
      allowNull: true
    },
    sourceKey: 'id_prestamos',
    as: 'devolucion',
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE'
  });
}