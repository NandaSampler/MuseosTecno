// Modelo para la colección "Horario"
const mongoose = require('mongoose');

const horarioSchema = new mongoose.Schema({
  dia_semana: {
    type: Date,
    required: true,
  },
  hora_apertura: {
    type: String, // Almacenado como string tipo "HH:mm:ss"
    required: true,
  },
  hora_cierre: {
    type: String, // Almacenado como string tipo "HH:mm:ss"
    required: true,
  },
  museo_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Museo', // Relación con el modelo Museo
    required: true,
  },
}, {
  collection: 'horario',
  timestamps: false,
});

const Horario = mongoose.model('Horario', horarioSchema);
module.exports = Horario;
