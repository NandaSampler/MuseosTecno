const Comentario = require('../models/comentarioModel');
const Usuario = require('../models/usuarioModel');
const Museo = require('../models/museoModel');

/**
 * Crear un nuevo comentario
 */
const createComentario = async (req, res) => {
  try {
    const { comentario, valoracion, usuario_id, museo_id } = req.body;

    // Validación básica (sin fecha_comentario)
    if (!comentario || !valoracion || !usuario_id || !museo_id) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
    }

    // Validar rango de valoración
    if (valoracion < 1 || valoracion > 5) {
      return res.status(400).json({ error: 'La valoración debe estar entre 1 y 5 estrellas.' });
    }

    // Verificar existencia de usuario y museo
    const usuario = await Usuario.findById(usuario_id);
    const museo = await Museo.findById(museo_id);

    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado.' });
    }

    if (!museo) {
      return res.status(404).json({ error: 'Museo no encontrado.' });
    }

    const nuevoComentario = new Comentario({
      comentario,
      valoracion,
      usuario_id,
      museo_id,
    });

    await nuevoComentario.save();
    return res.status(201).json({ message: 'Comentario creado exitosamente.', comentario: nuevoComentario });
  } catch (error) {
    return res.status(500).json({ error: 'Error al crear el comentario.', details: error.message });
  }
};


/**
 * Obtener todos los comentarios
 */
const getComentarios = async (req, res) => {
  try {
    const comentarios = await Comentario.find()
      .populate('usuario_id', 'nombre email')
      .populate('museo_id', 'nombre');

    return res.status(200).json(comentarios);
  } catch (error) {
    return res.status(500).json({ error: 'Error al obtener los comentarios.', details: error.message });
  }
};

/**
 * Obtener un comentario por ID
 */
const getComentarioById = async (req, res) => {
  try {
    const { id } = req.params;

    const comentario = await Comentario.findById(id)
      .populate('usuario_id', 'nombre email')
      .populate('museo_id', 'nombre');

    if (!comentario) {
      return res.status(404).json({ message: 'Comentario no encontrado.' });
    }

    return res.status(200).json(comentario);
  } catch (error) {
    return res.status(500).json({ error: 'Error al obtener el comentario.', details: error.message });
  }
};

/**
 * Actualizar un comentario
 */
const updateComentario = async (req, res) => {
  try {
    const { id } = req.params;
    const { comentario, fecha_comentario, valoracion, usuario_id, museo_id } = req.body;

    const comentarioDoc = await Comentario.findById(id);
    if (!comentarioDoc) {
      return res.status(404).json({ message: 'Comentario no encontrado.' });
    }

    // Validar relaciones si se actualizan
    if (usuario_id) {
      const usuario = await Usuario.findById(usuario_id);
      if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado.' });
      comentarioDoc.usuario_id = usuario_id;
    }

    if (museo_id) {
      const museo = await Museo.findById(museo_id);
      if (!museo) return res.status(404).json({ error: 'Museo no encontrado.' });
      comentarioDoc.museo_id = museo_id;
    }

    if (comentario) comentarioDoc.comentario = comentario;
    if (fecha_comentario) comentarioDoc.fecha_comentario = fecha_comentario;
    if (valoracion) comentarioDoc.valoracion = valoracion;

    await comentarioDoc.save();
    return res.status(200).json({ message: 'Comentario actualizado.', comentario: comentarioDoc });
  } catch (error) {
    return res.status(500).json({ error: 'Error al actualizar el comentario.', details: error.message });
  }
};

/**
 * Eliminar un comentario
 */
const deleteComentario = async (req, res) => {
  try {
    const { id } = req.params;

    const comentario = await Comentario.findByIdAndDelete(id);
    if (!comentario) {
      return res.status(404).json({ message: 'Comentario no encontrado.' });
    }

    return res.status(200).json({ message: 'Comentario eliminado exitosamente.' });
  } catch (error) {
    return res.status(500).json({ error: 'Error al eliminar el comentario.', details: error.message });
  }
};

/**
 * Obtener todos los comentarios de un museo específico
 */
const getComentariosPorMuseo = async (req, res) => {
  try {
    const { museoId } = req.params;

    const comentarios = await Comentario.find({ museo_id: museoId })
      .populate('usuario_id', 'nombre email')
      .populate('museo_id', 'nombre');

    return res.status(200).json(comentarios);
  } catch (error) {
    return res.status(500).json({
      error: 'Error al obtener comentarios del museo.',
      details: error.message,
    });
  }
};


module.exports = {
  createComentario,
  getComentarios,
  getComentarioById,
  updateComentario,
  deleteComentario,
  getComentariosPorMuseo,
};
