const express = require('express');
const {
  createHorario,
  getHorarios,
  getHorarioById,
  updateHorario,
  deleteHorario,
  getHorariosCompletosPorMuseo,
} = require('../controllers/horarioController');

const router = express.Router();

// Crear un nuevo horario
router.post('/', createHorario);

// Obtener todos los horarios
router.get('/', getHorarios);

// Obtener horarios completos incluyendo días en los que cierra, por museo
router.get('/completos/:museoId', getHorariosCompletosPorMuseo);

// Obtener un horario por ID
router.get('/:id', getHorarioById);

// Actualizar un horario
router.put('/:id', updateHorario);

// Eliminar un horario
router.delete('/:id', deleteHorario);

module.exports = router;
