// Modelo para la colección "Museo"
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
  departamento_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Dpto', // Relación con el modelo Dpto
    required: true,
  },
}, {
  collection: 'museo',
  timestamps: false,
});

const Museo = mongoose.model('Museo', museoSchema);
module.exports = Museo;
