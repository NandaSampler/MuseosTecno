const bcrypt = require('bcrypt');
const Admin = require('../models/adminModel.js');

// Obtener todos los administradores
const getAdmins = async (req, res) => {
  try {
    const admins = await Admin.find().sort({ _id: -1 });
    res.status(200).json(admins);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los administradores', details: error.message });
  }
};

// Obtener un administrador por ID
const getAdmin = async (req, res) => {
  const { id } = req.params;

  try {
    const admin = await Admin.findById(id);
    if (!admin) {
      return res.status(404).json({ error: 'No se encontró el administrador' });
    }
    res.status(200).json(admin);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el administrador', details: error.message });
  }
};

// Crear un nuevo administrador con contraseña encriptada
const createAdmin = async (req, res) => {
  const { nombre, apellido, email, password, rol } = req.body;

  try {
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ success: false, message: 'El correo ya está registrado' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newAdmin = new Admin({
      nombre,
      apellido,
      email,
      password: hashedPassword,
      rol
    });

    await newAdmin.save();

    res.status(201).json({
      success: true,
      message: 'Administrador creado exitosamente',
      data: newAdmin,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Error al crear el administrador', details: error.message });
  }
};

// Eliminar un administrador por ID
const deleteAdmin = async (req, res) => {
  const { id } = req.params;

  try {
    const admin = await Admin.findByIdAndDelete(id);
    if (!admin) {
      return res.status(404).json({ error: 'No se encontró el administrador para eliminar' });
    }
    res.status(200).json({ success: true, message: 'Administrador eliminado con éxito' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el administrador', details: error.message });
  }
};

// Actualizar un administrador por ID
const updateAdmin = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    if (updates.password) {
      const salt = await bcrypt.genSalt(10);
      updates.password = await bcrypt.hash(updates.password, salt);
    }

    const updatedAdmin = await Admin.findByIdAndUpdate(id, updates, { new: true });
    if (!updatedAdmin) {
      return res.status(404).json({ error: 'No se encontró el administrador para actualizar' });
    }

    res.status(200).json({
      success: true,
      message: 'Administrador actualizado exitosamente',
      data: updatedAdmin,
    });
  } catch (error) {
    res.status(400).json({ error: 'Error al actualizar el administrador', details: error.message });
  }
};

// Método de login
const loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({ error: 'Correo o contraseña incorrectos' });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Correo o contraseña incorrectos' });
    }
    const payload = {
      id: admin._id,
      email: admin.email,
      rol: admin.rol,
      tipo: 'admin'
    };

    const token = jwt.sign(payload, SECRET, { expiresIn: '2h' });
    res.status(200).json({
      success: true,
      message: 'Inicio de sesión exitoso',
      token,
      admin: {
        id: admin._id,
        nombre: admin.nombre,
        apellido: admin.apellido,
        email: admin.email,
        rol: admin.rol
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al iniciar sesión', details: error.message });
  }
};

module.exports = {
  getAdmins,
  getAdmin,
  createAdmin,
  deleteAdmin,
  updateAdmin,
  loginAdmin,
};
