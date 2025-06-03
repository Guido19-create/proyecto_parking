import { DataTypes } from 'sequelize';
import { sequelize } from '../../config/databaseConection.js';

// 1. Definición del modelo base
export const Documentos = sequelize.define('Documentos', {
  id_documento: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    comment: 'ID único del documento'
  },
  tipoDeDocumento: {
    type: DataTypes.ENUM('libro', 'revista', 'tesis', 'material audiovisual', 'documento digital'),
    allowNull: false,
    comment: 'Tipo de documento'
  },
  genero: {
    type: DataTypes.STRING(100),
    allowNull: false,
    comment: 'Género o categoría principal'
  },
  autor: {
    type: DataTypes.STRING(255),
    allowNull: false,
    comment: 'Autor o creador principal',
    validate: {
      notEmpty: {
        msg: 'El campo autor no puede estar vacío'
      }
    }
  },
  nombreDocumento: {
    type: DataTypes.STRING(255),
    allowNull: false,
    comment: 'Título completo del documento',
    validate: {
      len: {
        args: [3, 255],
        msg: 'El nombre debe tener entre 3 y 255 caracteres'
      }
    }
  },
  isbn: {
    type: DataTypes.STRING(20),
    allowNull: true,
    unique: true,
    comment: 'ISBN o identificador único para libros'
  },
  cantidadDisponible: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
    validate: {
      min: {
        args: [0],
        msg: 'La cantidad no puede ser negativa'
      }
    },
    comment: 'Cantidad de copias disponibles'
  },
  cantidadTotal: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
    comment: 'Cantidad total de copias existentes'
  },
  estadoDelDocumento: {
    type: DataTypes.ENUM('perfecto', 'dañado', 'en reparación', 'perdido'),
    allowNull: false,
    defaultValue: 'perfecto',
    comment: 'Estado físico del documento'
  },
  ubicacion: {
    type: DataTypes.STRING(100),
    allowNull: false,
    comment: 'Ubicación física en la biblioteca'
  },
  fechaAdquisicion: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    comment: 'Fecha cuando se adquirió el documento'
  }
}, {
  tableName: 'documentos',
  timestamps: true,
  comment: 'Catálogo de documentos disponibles en la biblioteca',
  indexes: [
    {
      fields: ['autor'],
      name: 'idx_documentos_autor'
    },
    {
      fields: ['nombreDocumento'],
      name: 'idx_documentos_titulo'
    },
    {
      fields: ['genero'],
      name: 'idx_documentos_genero'
    }
  ]
});

// 2. Función para configurar relaciones
export async function configurarRelacionesDocumentos() {
  // Importación dinámica de modelos relacionados
  const { Prestamos } = await import('./Prestamos.js');
  const { Solicitudes } = await import('./Solicitudes.js');
  
  // Relación con Préstamos (documentos prestados)
  Documentos.hasMany(Prestamos, {
    foreignKey: {
      name: 'documentoId',
      allowNull: false
    },
    sourceKey: 'id_documento',
    as: 'prestamos',
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE'
  });

  // Relación con Solicitudes (documentos solicitados)
  Documentos.hasMany(Solicitudes, {
    foreignKey: {
      name: 'documentoId',
      allowNull: false
    },
    sourceKey: 'id_documento',
    as: 'solicitudes',
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE'
  });
}