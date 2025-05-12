const upload = require('../middlewares/upload');
const express = require('express');
const {
  createMuseo,
  getMuseos,
  getMuseoById,
  updateMuseo,
  deleteMuseo,
  getMuseosPendientes,
  cambiarEstadoMuseo
} = require('../controllers/museoController');

const router = express.Router();

// Crear un nuevo museo
router.post(
  '/',
  upload.fields([
    { name: 'foto', maxCount: 1 },
    { name: 'galeria', maxCount: 10 },
  ]),
  createMuseo
);

// Obtener todos los museos
router.get('/', getMuseos);

// Obtener museos pendientes (para superadmin)
router.get('/pendientes', getMuseosPendientes);

// Cambiar estado del museo
router.patch('/:id/estado', cambiarEstadoMuseo);

// Obtener un museo por ID
router.get('/:id', getMuseoById);

// Actualizar un museo
router.put('/:id', updateMuseo);

// Eliminar un museo
router.delete('/:id', deleteMuseo);

module.exports = router;
