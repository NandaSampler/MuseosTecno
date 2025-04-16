// Modelo para la colección "Visita"
const mongoose = require('mongoose');

const visitaSchema = new mongoose.Schema({
  fecha_visita: {
    type: Date,
    required: true,
  },
  numero_visitantes: {
    type: Number,
    required: true,
    min: 1,
  },
  comentarios: {
    type: String,
    required: true,
  },
  museo_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Museo', // Relación con el modelo Museo
    required: true,
  },
  usuario_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario', // Relación con el modelo Usuario
    required: true,
  },
}, {
  collection: 'visita',
  timestamps: false,
});

const Visita = mongoose.model('Visita', visitaSchema);
module.exports = Visita;
