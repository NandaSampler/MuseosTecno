const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuarioModel.js');
const SECRET = 'tu_clave_secreta';

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
  const { nombre, apellido, email, password, favoritos } = req.body;

  try {
    const existingUser = await Usuario.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'El correo ya está registrado' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new Usuario({
      nombre,
      apellido,
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

// Método de login
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await Usuario.findOne({ email }).populate('favoritos');
    if (!user) {
      return res.status(401).json({ error: 'Correo o contraseña incorrectos' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Correo o contraseña incorrectos' });
    }

    const payload = {
      id: user._id,
      email: user.email,  
    };
    const token = jwt.sign(payload, SECRET, { expiresIn: '2h' });
    console.log('🛡️  JWT generado:', token);

    res.status(200).json({
      success: true,
      message: 'Inicio de sesión exitoso',
      token,
      usuario: {
        id: user._id,
        nombre: user.nombre,
        apellido: user.apellido,
        email: user.email,
        favoritos: user.favoritos
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al iniciar sesión', details: error.message });
  }
};

// Agregar o quitar museo de favoritos
const toggleFavorito = async (req, res) => {
  const { userId } = req.params;
  const { museoId } = req.body;

  try {
    const usuario = await Usuario.findById(userId);
    if (!usuario) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const index = usuario.favoritos.indexOf(museoId);

    if (index === -1) {
      usuario.favoritos.push(museoId); // agregar
    } else {
      usuario.favoritos.splice(index, 1); // quitar
    }

    await usuario.save();

    res.status(200).json({
      success: true,
      message: "Favoritos actualizados",
      favoritos: usuario.favoritos,
    });
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar favoritos", details: error.message });
  }
};


module.exports = {
  getUsers,
  getUser,
  createUser,
  deleteUser,
  updateUser,
  loginUser,
  toggleFavorito,
};
