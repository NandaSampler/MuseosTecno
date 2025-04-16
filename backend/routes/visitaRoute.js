const express = require('express');
const {
  createVisita,
  getVisitas,
  getVisitaById,
  updateVisita,
  deleteVisita,
} = require('../controllers/visitaController');

const router = express.Router();

// Crear una nueva visita
router.post('/', createVisita);

// Obtener todas las visitas
router.get('/', getVisitas);

// Obtener una visita por ID
router.get('/:id', getVisitaById);

// Actualizar una visita
router.put('/:id', updateVisita);

// Eliminar una visita
router.delete('/:id', deleteVisita);

module.exports = router;
