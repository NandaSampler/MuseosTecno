const express = require('express');
const {
  createMuseo,
  getMuseos,
  getMuseoById,
  updateMuseo,
  deleteMuseo,
} = require('../controllers/museoController');

const router = express.Router();

// Crear un nuevo museo
router.post('/', createMuseo);

// Obtener todos los museos
router.get('/', getMuseos);

// Obtener un museo por ID
router.get('/:id', getMuseoById);

// Actualizar un museo
router.put('/:id', updateMuseo);

// Eliminar un museo
router.delete('/:id', deleteMuseo);

module.exports = router;
