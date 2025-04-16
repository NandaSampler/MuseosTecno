const express = require('express');
const {
  getAdmins,
  getAdmin,
  createAdmin,
  deleteAdmin,
  updateAdmin,
} = require('../controllers/adminController');

const authenticateToken = require('../middlewares/authMiddleware');
const checkRole = require('../middlewares/roleMiddleware');

const router = express.Router();

// Obtener todos los administradores (solo para administradores autenticados)
router.get('/', authenticateToken, checkRole('admin'), getAdmins);

// Obtener un administrador por ID (autenticación requerida)
router.get('/:id', authenticateToken, getAdmin);

// Crear un nuevo administrador (solo para admins)
router.post('/', authenticateToken, checkRole('admin'), createAdmin);

// Eliminar un administrador por ID (solo para admins)
router.delete('/:id', authenticateToken, checkRole('admin'), deleteAdmin);

// Actualizar un administrador por ID (solo para admins)
router.patch('/:id', authenticateToken, checkRole('admin'), updateAdmin);

module.exports = router;
