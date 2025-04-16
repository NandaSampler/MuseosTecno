// Modelo para la colección "Dpto"
const mongoose = require('mongoose');

const dptoSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    maxlength: 100,
  },
}, {
  collection: 'dpto',
  timestamps: false,
});

const Dpto = mongoose.model('Dpto', dptoSchema);
module.exports = Dpto;
