const express = require('express');
const {
  createVisita,
  getVisitas,
  getVisitaById,
  updateVisita,
  deleteVisita,
  getVisitasPorUsuario,
  getVisitasPorMuseo,
} = require('../controllers/visitaController');

const router = express.Router();

// Crear una nueva visita
router.post('/', createVisita);

// Obtener todas las visitas
router.get('/', getVisitas);

// Obtener visitas por usuario
router.get('/usuario/:usuarioId', getVisitasPorUsuario);

// Obtener visitas por museo
router.get('/museo/:museoId', getVisitasPorMuseo);

// Obtener una visita por ID
router.get('/:id', getVisitaById);

// Actualizar una visita
router.put('/:id', updateVisita);

// Eliminar una visita
router.delete('/:id', deleteVisita);

module.exports = router;
