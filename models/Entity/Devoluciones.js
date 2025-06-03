import { DataTypes } from 'sequelize';
import { sequelize } from '../../config/databaseConection.js';

// 1. Definición del modelo base
export const Devoluciones = sequelize.define('Devoluciones', {
  id_devolucion: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    comment: 'ID único de la devolución'
  },
  fechaDevolucion: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    comment: 'Fecha real de devolución',
    validate: {
      isDate: {
        msg: 'La fecha de devolución debe ser válida'
      }
    }
  },
  estadoDelDocumento: {
    type: DataTypes.ENUM('perfecto', 'dañado', 'perdido', 'requiere reparación'),
    allowNull: false,
    comment: 'Estado en que se devuelve el documento'
  },
  observaciones: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Detalles sobre el estado o incidencias'
  },
  diasRetraso: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    comment: 'Días de retraso en la devolución'
  }
}, {
  tableName: 'devoluciones',
  timestamps: true,
  comment: 'Registro de devoluciones de documentos prestados',
});

// 2. Función para configurar relaciones
export async function configurarRelacionesDevoluciones() {
  // Importación dinámica del modelo Prestamos
  const { Prestamos } = await import('./Prestamos.js');
  
  // Relación con Préstamo (origen de la devolución)
  Devoluciones.belongsTo(Prestamos, {
    foreignKey: {
      name: 'prestamoId',
      allowNull: false
    },
    targetKey: 'id_prestamos',
    as: 'prestamo',
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE'
  });

  // Hook para actualizar el préstamo relacionado
  Devoluciones.addHook('afterCreate', async (devolucion) => {
    await devolucion.getPrestamo().then(async prestamo => {
      await prestamo.update({ estado: 'completado' });
      
      // Actualizar disponibilidad del documento
      const documento = await prestamo.getDocumento();
      await documento.increment('cantidadDisponible', { by: 1 });
    });
  });
}