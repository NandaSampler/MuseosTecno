const mongoose = require('mongoose');

const horarioSchema = new mongoose.Schema({
  dia_semana: {
    type: String,
    required: true,
    enum: [
      'Lunes',
      'Martes',
      'Miércoles',
      'Jueves',
      'Viernes',
      'Sábado',
      'Domingo',
      'Feriado'
    ]
  },
  hora_apertura: {
    type: String, // Ejemplo: "09:00:00"
    required: true,
  },
  hora_cierre: {
    type: String, // Ejemplo: "17:00:00"
    required: true,
  },
  museo_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Museo',
    required: true,
  }
}, {
  collection: 'horario',
  timestamps: false
});

const Horario = mongoose.model('Horario', horarioSchema);
module.exports = Horario;
