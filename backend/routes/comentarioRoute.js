const express = require('express');
const {
  createComentario,
  getComentarios,
  getComentarioById,
  updateComentario,
  deleteComentario,
  getComentariosPorMuseo,
  getComentariosPorUsuario,
} = require('../controllers/comentarioController');

const router = express.Router();

// Crear un comentario
router.post('/', createComentario);

// Obtener todos los comentarios
router.get('/', getComentarios);

// Obtener comentarios por ID de museo
router.get('/museo/:museoId', getComentariosPorMuseo);

// Obtener un comentario por ID
router.get('/:id', getComentarioById);

// Actualizar un comentario
router.put('/:id', updateComentario);

// Eliminar un comentario
router.delete('/:id', deleteComentario);

router.get('/usuario/:usuarioId', getComentariosPorUsuario);

module.exports = router;
