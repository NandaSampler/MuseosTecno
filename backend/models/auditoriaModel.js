// Modelo para la colección "Auditoria"
const mongoose = require('mongoose');

const auditoriaSchema = new mongoose.Schema({
  accion: {
    type: String,
    required: true,
    maxlength: 50,
  },
  fecha_accion: {
    type: Date,
    required: true,
  },
  administrador_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin', // Relación con el modelo Admin
    required: true,
  },
}, {
  collection: 'auditoria',
  timestamps: false,
});

const Auditoria = mongoose.model('Auditoria', auditoriaSchema);
module.exports = Auditoria;
