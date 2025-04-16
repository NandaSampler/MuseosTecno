const Museo = require('../models/museoModel');
const Dpto = require('../models/dptoModel'); // Para verificar si existe el departamento relacionado

/**
 * Crear un nuevo museo
 */
const createMuseo = async (req, res) => {
  try {
    const { nombre, ubicacion, historia, descripcion, foto, departamento_id } = req.body;

    if (!nombre || !ubicacion || !historia || !descripcion || !foto || !departamento_id) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
    }

    // Verifica que exista el departamento relacionado
    const dpto = await Dpto.findById(departamento_id);
    if (!dpto) {
      return res.status(404).json({ error: 'Departamento no encontrado.' });
    }

    const nuevoMuseo = new Museo({
      nombre,
      ubicacion,
      historia,
      descripcion,
      foto,
      departamento_id,
    });

    await nuevoMuseo.save();
    return res.status(201).json({ message: 'Museo creado exitosamente.', museo: nuevoMuseo });
  } catch (error) {
    return res.status(500).json({ error: 'Error al crear el museo.', details: error.message });
  }
};

/**
 * Obtener todos los museos
 */
const getMuseos = async (req, res) => {
  try {
    const museos = await Museo.find().populate('departamento_id');
    return res.status(200).json(museos);
  } catch (error) {
    return res.status(500).json({ error: 'Error al obtener los museos.', details: error.message });
  }
};

/**
 * Obtener un museo por ID
 */
const getMuseoById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ error: 'ID de museo no válido.' });
    }

    const museo = await Museo.findById(id).populate('departamento_id');
    if (!museo) {
      return res.status(404).json({ message: 'Museo no encontrado.' });
    }

    return res.status(200).json(museo);
  } catch (error) {
    return res.status(500).json({ error: 'Error al obtener el museo.', details: error.message });
  }
};

/**
 * Actualizar un museo
 */
const updateMuseo = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, ubicacion, historia, descripcion, foto, departamento_id } = req.body;

    const museo = await Museo.findById(id);
    if (!museo) {
      return res.status(404).json({ message: 'Museo no encontrado.' });
    }

    // Validar si se proporciona un nuevo departamento
    if (departamento_id) {
      const dpto = await Dpto.findById(departamento_id);
      if (!dpto) {
        return res.status(404).json({ error: 'Departamento no encontrado.' });
      }
      museo.departamento_id = departamento_id;
    }

    if (nombre) museo.nombre = nombre;
    if (ubicacion) museo.ubicacion = ubicacion;
    if (historia) museo.historia = historia;
    if (descripcion) museo.descripcion = descripcion;
    if (foto) museo.foto = foto;

    await museo.save();
    return res.status(200).json({ message: 'Museo actualizado.', museo });
  } catch (error) {
    return res.status(500).json({ error: 'Error al actualizar el museo.', details: error.message });
  }
};

/**
 * Eliminar un museo
 */
const deleteMuseo = async (req, res) => {
  try {
    const { id } = req.params;

    const museo = await Museo.findByIdAndDelete(id);
    if (!museo) {
      return res.status(404).json({ message: 'Museo no encontrado.' });
    }

    return res.status(200).json({ message: 'Museo eliminado exitosamente.' });
  } catch (error) {
    return res.status(500).json({ error: 'Error al eliminar el museo.', details: error.message });
  }
};

module.exports = {
  createMuseo,
  getMuseos,
  getMuseoById,
  updateMuseo,
  deleteMuseo,
};
