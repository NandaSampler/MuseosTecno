const express = require('express');
const {
  getAdmins,
  getAdmin,
  createAdmin,
  deleteAdmin,
  updateAdmin,
} = require('../controllers/adminController');

const router = express.Router();

// Obtener todos los administradores
router.get('/', getAdmins);

// Obtener un administrador por ID
router.get('/:id', getAdmin);

// Crear un nuevo administrador
router.post('/', createAdmin);

// Eliminar un administrador por ID
router.delete('/:id', deleteAdmin);

// Actualizar un administrador por ID
router.patch('/:id', updateAdmin);

module.exports = router;
