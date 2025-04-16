const express = require('express');
const {
  createAuditoria,
  getAuditorias,
  getAuditoriaById,
  deleteAuditoria,
} = require('../controllers/auditoriaController');

const router = express.Router();

// Crear una nueva auditoría
router.post('/', createAuditoria);

// Obtener todas las auditorías
router.get('/', getAuditorias);

// Obtener una auditoría por ID
router.get('/:id', getAuditoriaById);

// Eliminar una auditoría por ID
router.delete('/:id', deleteAuditoria);

module.exports = router;
