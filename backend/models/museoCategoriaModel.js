// Modelo para la colección "Museo_Categoria"
const mongoose = require('mongoose');

const museoCategoriaSchema = new mongoose.Schema({
  museo_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Museo', // Relación con el modelo Museo
    required: true,
  },
  categoria_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Categoria', // Relación con el modelo Categoria
    required: true,
  },
}, {
  collection: 'museo_categoria',
  timestamps: false,
});

const MuseoCategoria = mongoose.model('MuseoCategoria', museoCategoriaSchema);
module.exports = MuseoCategoria;
