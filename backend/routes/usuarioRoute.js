const express = require('express');
const {
  getUsers,
  getUser,
  createUser,
  deleteUser,
  updateUser,
} = require('../controllers/usuarioController');

const router = express.Router();

// Crear un nuevo usuario
router.post('/', createUser);

// Obtener todos los usuarios
router.get('/', getUsers);

// Obtener un usuario por ID
router.get('/:id', getUser);

// Actualizar un usuario por ID
router.put('/:id', updateUser);

// Eliminar un usuario por ID
router.delete('/:id', deleteUser);

module.exports = router;
