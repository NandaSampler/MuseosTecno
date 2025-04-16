const MuseoCategoria = require('../models/museoCategoriaModel');
const Museo = require('../models/museoModel');
const Categoria = require('../models/categoriaModel');

/**
 * Crear una nueva relación museo-categoría
 */
const createMuseoCategoria = async (req, res) => {
  try {
    const { museo_id, categoria_id } = req.body;

    if (!museo_id || !categoria_id) {
      return res.status(400).json({ error: 'El ID del museo y de la categoría son obligatorios.' });
    }

    const museo = await Museo.findById(museo_id);
    const categoria = await Categoria.findById(categoria_id);

    if (!museo) {
      return res.status(404).json({ error: 'Museo no encontrado.' });
    }

    if (!categoria) {
      return res.status(404).json({ error: 'Categoría no encontrada.' });
    }

    const relacion = new MuseoCategoria({ museo_id, categoria_id });
    await relacion.save();

    return res.status(201).json({ message: 'Relación creada exitosamente.', relacion });
  } catch (error) {
    return res.status(500).json({
      error: 'Error al crear la relación museo-categoría.',
      details: error.message,
    });
  }
};

/**
 * Obtener todas las relaciones museo-categoría
 */
const getMuseoCategorias = async (req, res) => {
  try {
    const relaciones = await MuseoCategoria.find()
      .populate('museo_id', 'nombre')
      .populate('categoria_id', 'nombre');

    return res.status(200).json(relaciones);
  } catch (error) {
    return res.status(500).json({
      error: 'Error al obtener las relaciones.',
      details: error.message,
    });
  }
};

/**
 * Obtener una relación museo-categoría por ID
 */
const getMuseoCategoriaById = async (req, res) => {
  try {
    const { id } = req.params;

    const relacion = await MuseoCategoria.findById(id)
      .populate('museo_id', 'nombre')
      .populate('categoria_id', 'nombre');

    if (!relacion) {
      return res.status(404).json({ message: 'Relación no encontrada.' });
    }

    return res.status(200).json(relacion);
  } catch (error) {
    return res.status(500).json({
      error: 'Error al obtener la relación.',
      details: error.message,
    });
  }
};

/**
 * Eliminar una relación museo-categoría
 */
const deleteMuseoCategoria = async (req, res) => {
  try {
    const { id } = req.params;

    const relacion = await MuseoCategoria.findByIdAndDelete(id);
    if (!relacion) {
      return res.status(404).json({ message: 'Relación no encontrada.' });
    }

    return res.status(200).json({ message: 'Relación eliminada exitosamente.' });
  } catch (error) {
    return res.status(500).json({
      error: 'Error al eliminar la relación.',
      details: error.message,
    });
  }
};

module.exports = {
  createMuseoCategoria,
  getMuseoCategorias,
  getMuseoCategoriaById,
  deleteMuseoCategoria,
};
