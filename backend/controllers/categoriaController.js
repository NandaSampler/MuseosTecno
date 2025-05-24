// models/categoriaModel.js
const mongoose = require('mongoose');
// controllers/categoriaController.js
const Categoria = require('../models/categoriaModel');

/**
 * Crear una nueva categoría
 */
const createCategoria = async (req, res) => {
  try {
    const { nombre } = req.body;

    if (!nombre || nombre.trim() === '') {
      return res.status(400).json({ error: 'El nombre de la categoría es obligatorio.' });
    }

    const nuevaCategoria = new Categoria({ nombre: nombre.trim() });
    await nuevaCategoria.save();

    return res.status(201).json({
      message: 'Categoría creada exitosamente.',
      categoria: nuevaCategoria,
    });
  } catch (error) {
    // Manejo de error de clave única
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Ya existe una categoría con ese nombre.' });
    }
    return res.status(500).json({
      error: 'Error interno al crear la categoría.',
      details: error.message,
    });
  }
};

/**
 * Obtener todas las categorías
 */
const getCategorias = async (req, res) => {
  try {
    const categorias = await Categoria.find();
    return res.status(200).json(categorias);
  } catch (error) {
    return res.status(500).json({
      error: 'Error al obtener las categorías.',
      details: error.message,
    });
  }
};

/**
 * Obtener una categoría por ID
 */
const getCategoriaById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ error: 'ID de categoría no válido.' });
    }

    const categoria = await Categoria.findById(id);
    if (!categoria) {
      return res.status(404).json({ message: 'Categoría no encontrada.' });
    }

    return res.status(200).json(categoria);
  } catch (error) {
    return res.status(500).json({
      error: 'Error al obtener la categoría.',
      details: error.message,
    });
  }
};

/**
 * Actualizar una categoría
 */
const updateCategoria = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre } = req.body;

    const categoria = await Categoria.findById(id);
    if (!categoria) {
      return res.status(404).json({ message: 'Categoría no encontrada.' });
    }

    if (nombre && nombre.trim() !== categoria.nombre) {
      categoria.nombre = nombre.trim();
      await categoria.save();
      return res.status(200).json({ message: 'Categoría actualizada.', categoria });
    }
    return res.status(200).json({ message: 'No hubo cambios.', categoria });
  } catch (error) {
    // Manejo de duplicados en actualización
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Ya existe una categoría con ese nombre.' });
    }
    return res.status(500).json({
      error: 'Error al actualizar la categoría.',
      details: error.message,
    });
  }
};

/**
 * Eliminar una categoría
 */
const deleteCategoria = async (req, res) => {
  try {
    const { id } = req.params;

    const categoria = await Categoria.findByIdAndDelete(id);
    if (!categoria) {
      return res.status(404).json({ message: 'Categoría no encontrada.' });
    }

    return res.status(200).json({ message: 'Categoría eliminada exitosamente.' });
  } catch (error) {
    return res.status(500).json({
      error: 'Error al eliminar la categoría.',
      details: error.message,
    });
  }
};

module.exports = {
  createCategoria,
  getCategorias,
  getCategoriaById,
  updateCategoria,
  deleteCategoria,
};