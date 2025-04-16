const express = require('express');
const {
  createDpto,
  getDptos,
  getDptoById,
  updateDpto,
  deleteDpto,
} = require('../controllers/dptoController');

const router = express.Router();

// Crear un nuevo departamento
router.post('/', createDpto);

// Obtener todos los departamentos
router.get('/', getDptos);

// Obtener un departamento por ID
router.get('/:id', getDptoById);

// Actualizar un departamento
router.put('/:id', updateDpto);

// Eliminar un departamento
router.delete('/:id', deleteDpto);

module.exports = router;
