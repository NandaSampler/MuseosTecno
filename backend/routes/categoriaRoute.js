const express = require('express');
const {
  createCategoria,
  getCategorias,
  getCategoriaById,
  updateCategoria,
  deleteCategoria,
} = require('../controllers/categoriaController');

const router = express.Router();

// Crear una nueva categoría
router.post('/', createCategoria);

// Obtener todas las categorías
router.get('/', getCategorias);

// Obtener una categoría por ID
router.get('/:id', getCategoriaById);

// Actualizar una categoría
router.put('/:id', updateCategoria);

// Eliminar una categoría
router.delete('/:id', deleteCategoria);

module.exports = router;
