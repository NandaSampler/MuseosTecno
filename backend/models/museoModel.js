const mongoose = require('mongoose');

const museoSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
  },
  ubicacion: {
    type: String,
    required: true,
    maxlength: 100,
  },
  historia: {
    type: String,
    required: true,
    maxlength: 255,
  },
  descripcion: {
    type: String,
    required: true,
  },
  foto: {
    type: String,
    required: true,
    maxlength: 255,
  },
  galeria: [{
    type: String,
    maxlength: 255, // Cada URL o ruta de imagen puede tener hasta 255 caracteres
  }],
  departamento_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Dpto',
    required: true,
  },
}, {
  collection: 'museo',
  timestamps: false,
});

const Museo = mongoose.model('Museo', museoSchema);
module.exports = Museo;
