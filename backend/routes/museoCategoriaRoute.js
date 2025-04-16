const express = require('express');
const {
  createMuseoCategoria,
  getMuseoCategorias,
  getMuseoCategoriaById,
  deleteMuseoCategoria,
} = require('../controllers/museoCategoriaController');

const router = express.Router();

// Crear una nueva relación museo-categoría
router.post('/', createMuseoCategoria);

// Obtener todas las relaciones
router.get('/', getMuseoCategorias);

// Obtener una relación por ID
router.get('/:id', getMuseoCategoriaById);

// Eliminar una relación por ID
router.delete('/:id', deleteMuseoCategoria);

module.exports = router;
