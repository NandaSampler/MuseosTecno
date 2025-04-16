const Dpto = require('../models/dptoModel');

// Crear un nuevo departamento
const createDpto = async (req, res) => {
  try {
    const { nombre } = req.body;

    if (!nombre || nombre.trim() === '') {
      return res.status(400).json({ error: 'El nombre del departamento es obligatorio.' });
    }

    const newDpto = new Dpto({ nombre: nombre.trim() });
    await newDpto.save();

    return res.status(201).json({ message: 'Departamento creado exitosamente.', dpto: newDpto });
  } catch (error) {
    return res.status(500).json({ error: 'Error al crear el departamento.', details: error.message });
  }
};

// Obtener todos los departamentos
const getDptos = async (req, res) => {
  try {
    const dptos = await Dpto.find();
    return res.status(200).json(dptos);
  } catch (error) {
    return res.status(500).json({ error: 'Error al obtener los departamentos.', details: error.message });
  }
};

// Obtener un departamento por ID
const getDptoById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ error: 'ID de departamento no válido.' });
    }

    const dpto = await Dpto.findById(id);
    if (!dpto) {
      return res.status(404).json({ message: 'Departamento no encontrado.' });
    }

    return res.status(200).json(dpto);
  } catch (error) {
    return res.status(500).json({ error: 'Error al obtener el departamento.', details: error.message });
  }
};

// Actualizar un departamento
const updateDpto = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre } = req.body;

    const dpto = await Dpto.findById(id);
    if (!dpto) {
      return res.status(404).json({ message: 'Departamento no encontrado.' });
    }

    if (nombre) dpto.nombre = nombre.trim();

    await dpto.save();
    return res.status(200).json({ message: 'Departamento actualizado.', dpto });
  } catch (error) {
    return res.status(500).json({ error: 'Error al actualizar el departamento.', details: error.message });
  }
};

// Eliminar un departamento
const deleteDpto = async (req, res) => {
  try {
    const { id } = req.params;

    const dpto = await Dpto.findByIdAndDelete(id);
    if (!dpto) {
      return res.status(404).json({ message: 'Departamento no encontrado.' });
    }

    return res.status(200).json({ message: 'Departamento eliminado exitosamente.' });
  } catch (error) {
    return res.status(500).json({ error: 'Error al eliminar el departamento.', details: error.message });
  }
};

module.exports = {
  createDpto,
  getDptos,
  getDptoById,
  updateDpto,
  deleteDpto,
};
