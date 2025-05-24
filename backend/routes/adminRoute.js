const express = require('express');
const {
  getAdmins,
  getAdmin,
  createAdmin,
  deleteAdmin,
  updateAdmin,
  loginAdmin,
} = require('../controllers/adminController');
const { verificarToken, esAdmin, esSuperAdmin} = require('../middlewares/auth');
const router = express.Router();

router.post('/login', loginAdmin);

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
