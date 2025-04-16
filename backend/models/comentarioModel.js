// Modelo para la colección "Comentario"
const mongoose = require('mongoose');

const comentarioSchema = new mongoose.Schema({
  comentario: {
    type: String,
    required: true,
  },
  fecha_comentario: {
    type: Date,
    required: true,
  },
  valoracion: {
    type: String,
    required: true,
    maxlength: 50,
  },
  usuario_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario', // Relación con el modelo Usuario
    required: true,
  },
  museo_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Museo', // Relación con el modelo Museo
    required: true,
  },
}, {
  collection: 'comentario',
  timestamps: false,
});

const Comentario = mongoose.model('Comentario', comentarioSchema);
module.exports = Comentario;
