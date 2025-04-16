const Auditoria = require('../models/auditoriaModel');
const Admin = require('../models/adminModel');

/**
 * Crear una nueva entrada de auditoría
 */
const createAuditoria = async (req, res) => {
  try {
    const { accion, fecha_accion, administrador_id } = req.body;

    if (!accion || !fecha_accion || !administrador_id) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
    }

    const admin = await Admin.findById(administrador_id);
    if (!admin) {
      return res.status(404).json({ error: 'Administrador no encontrado.' });
    }

    const nuevaAuditoria = new Auditoria({
      accion,
      fecha_accion,
      administrador_id,
    });

    await nuevaAuditoria.save();
    return res.status(201).json({
      message: 'Registro de auditoría creado exitosamente.',
      auditoria: nuevaAuditoria,
    });
  } catch (error) {
    return res.status(500).json({
      error: 'Error al crear el registro de auditoría.',
      details: error.message,
    });
  }
};

/**
 * Obtener todos los registros de auditoría
 */
const getAuditorias = async (req, res) => {
  try {
    const auditorias = await Auditoria.find()
      .populate('administrador_id', 'nombre email')
      .sort({ fecha_accion: -1 });

    return res.status(200).json(auditorias);
  } catch (error) {
    return res.status(500).json({
      error: 'Error al obtener los registros de auditoría.',
      details: error.message,
    });
  }
};

/**
 * Obtener un registro de auditoría por ID
 */
const getAuditoriaById = async (req, res) => {
  try {
    const { id } = req.params;

    const auditoria = await Auditoria.findById(id)
      .populate('administrador_id', 'nombre email');

    if (!auditoria) {
      return res.status(404).json({ message: 'Registro de auditoría no encontrado.' });
    }

    return res.status(200).json(auditoria);
  } catch (error) {
    return res.status(500).json({
      error: 'Error al obtener el registro de auditoría.',
      details: error.message,
    });
  }
};

/**
 * Eliminar un registro de auditoría
 */
const deleteAuditoria = async (req, res) => {
  try {
    const { id } = req.params;

    const auditoria = await Auditoria.findByIdAndDelete(id);
    if (!auditoria) {
      return res.status(404).json({ message: 'Registro de auditoría no encontrado.' });
    }

    return res.status(200).json({ message: 'Registro de auditoría eliminado exitosamente.' });
  } catch (error) {
    return res.status(500).json({
      error: 'Error al eliminar el registro de auditoría.',
      details: error.message,
    });
  }
};

module.exports = {
  createAuditoria,
  getAuditorias,
  getAuditoriaById,
  deleteAuditoria,
};
