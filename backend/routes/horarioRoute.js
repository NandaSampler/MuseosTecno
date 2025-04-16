const express = require('express');
const {
  createHorario,
  getHorarios,
  getHorarioById,
  updateHorario,
  deleteHorario,
} = require('../controllers/horarioController');

const router = express.Router();

// Crear un nuevo horario
router.post('/', createHorario);

// Obtener todos los horarios
router.get('/', getHorarios);

// Obtener un horario por ID
router.get('/:id', getHorarioById);

// Actualizar un horario
router.put('/:id', updateHorario);

// Eliminar un horario
router.delete('/:id', deleteHorario);

module.exports = router;
