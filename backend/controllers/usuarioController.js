const bcrypt = require('bcrypt');
const Usuario = require('../models/usuarioModel.js');

// Obtener todos los usuarios
const getUsers = async (req, res) => {
  try {
    const users = await Usuario.find().populate('favoritos').sort({ _id: -1 });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los usuarios', details: error.message });
  }
};

// Obtener un usuario por ID
const getUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await Usuario.findById(id).populate('favoritos');
    if (!user) {
      return res.status(404).json({ error: 'No se encontró el usuario' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el usuario', details: error.message });
  }
};

// Crear un nuevo usuario
const createUser = async (req, res) => {
  const { nombre, email, password, favoritos } = req.body;

  try {
    const existingUser = await Usuario.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'El correo ya está registrado' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new Usuario({
      nombre,
      email,
      password: hashedPassword,
      favoritos: favoritos || [],
    });

    await newUser.save();

    res.status(201).json({
      success: true,
      message: 'Usuario creado exitosamente',
      data: newUser,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Error al crear el usuario', details: error.message });
  }
};

// Eliminar un usuario por ID
const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await Usuario.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ error: 'No se encontró el usuario para eliminar' });
    }
    res.status(200).json({ success: true, message: 'Usuario eliminado con éxito' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el usuario', details: error.message });
  }
};

// Actualizar un usuario por ID
const updateUser = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    if (updates.password) {
      const salt = await bcrypt.genSalt(10);
      updates.password = await bcrypt.hash(updates.password, salt);
    }

    const updatedUser = await Usuario.findByIdAndUpdate(id, updates, { new: true });
    if (!updatedUser) {
      return res.status(404).json({ error: 'No se encontró el usuario para actualizar' });
    }
    res.status(200).json({
      success: true,
      message: 'Usuario actualizado exitosamente',
      data: updatedUser,
    });
  } catch (error) {
    res.status(400).json({ error: 'Error al actualizar el usuario', details: error.message });
  }
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  deleteUser,
  updateUser,
};
