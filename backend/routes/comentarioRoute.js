const express = require('express');
const {
  createComentario,
  getComentarios,
  getComentarioById,
  updateComentario,
  deleteComentario,
} = require('../controllers/comentarioController');

const router = express.Router();

// Crear un comentario
router.post('/', createComentario);

// Obtener todos los comentarios
router.get('/', getComentarios);

// Obtener un comentario por ID
router.get('/:id', getComentarioById);

// Actualizar un comentario
router.put('/:id', updateComentario);

// Eliminar un comentario
router.delete('/:id', deleteComentario);

module.exports = router;
