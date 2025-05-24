// Modelo para la colección "Visita"
const mongoose = require('mongoose');

const visitaSchema = new mongoose.Schema({
  fecha_hora_visita: {
    type: Date,
    required: true
  },
  numero_visitantes: {
    type: Number,
    required: true,
    min: 1
  },
  nota: {
    type: String,
    trim: true
  },
  guia: {
    type: Boolean,
    default: false
  },
  idioma_guia: {
    type: String,
    enum: ['Español', 'Inglés', 'Francés', 'Portugués', 'Otro'],
    default: 'Español'
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
