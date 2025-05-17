const express = require('express');
const {
  getUsers,
  getUser,
  createUser,
  deleteUser,
  updateUser,
  loginUser,
} = require('../controllers/usuarioController');
const { verificarToken} = require('../middlewares/auth');
const router = express.Router();

router.post('/login', loginUser);

// Crear un nuevo usuario
router.post('/', createUser);

// Obtener todos los usuarios
router.get('/', verificarToken, getUsers);

// Obtener un usuario por ID
router.get('/:id', verificarToken,getUser);

// Actualizar un usuario por ID
router.put('/:id', verificarToken,updateUser);

// Eliminar un usuario por ID
router.delete('/:id', verificarToken,deleteUser);

module.exports = router;
