// Modelo para la colección "Categoria"
const mongoose = require('mongoose');

const categoriaSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre de la categoría es obligatorio'],
    maxlength: [100, 'El nombre no puede tener más de 100 caracteres'],
    trim: true,
  },
}, {
  collection: 'categoria',
  timestamps: false,
});

const Categoria = mongoose.model('Categoria', categoriaSchema);
module.exports = Categoria;
