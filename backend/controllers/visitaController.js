const Visita = require('../models/visitaModel');
const Museo = require('../models/museoModel');
const Usuario = require('../models/usuarioModel');

/**
 * Crear una nueva visita
 */
const createVisita = async (req, res) => {
  try {
    const { fecha_visita, numero_visitantes, comentarios, museo_id, usuario_id } = req.body;

    if (!fecha_visita || !numero_visitantes || !comentarios || !museo_id || !usuario_id) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
    }

    // Verificar existencia de museo y usuario
    const museo = await Museo.findById(museo_id);
    const usuario = await Usuario.findById(usuario_id);

    if (!museo) {
      return res.status(404).json({ error: 'Museo no encontrado.' });
    }
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado.' });
    }

    const nuevaVisita = new Visita({
      fecha_visita,
      numero_visitantes,
      comentarios,
      museo_id,
      usuario_id,
    });

    await nuevaVisita.save();
    return res.status(201).json({ message: 'Visita registrada exitosamente.', visita: nuevaVisita });
  } catch (error) {
    return res.status(500).json({ error: 'Error al registrar la visita.', details: error.message });
  }
};

/**
 * Obtener todas las visitas
 */
const getVisitas = async (req, res) => {
  try {
    const visitas = await Visita.find()
      .populate('museo_id')
      .populate('usuario_id');

    return res.status(200).json(visitas);
  } catch (error) {
    return res.status(500).json({ error: 'Error al obtener las visitas.', details: error.message });
  }
};

/**
 * Obtener una visita por ID
 */
const getVisitaById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ error: 'ID de visita no válido.' });
    }

    const visita = await Visita.findById(id)
      .populate('museo_id')
      .populate('usuario_id');

    if (!visita) {
      return res.status(404).json({ message: 'Visita no encontrada.' });
    }

    return res.status(200).json(visita);
  } catch (error) {
    return res.status(500).json({ error: 'Error al obtener la visita.', details: error.message });
  }
};

/**
 * Actualizar una visita
 */
const updateVisita = async (req, res) => {
  try {
    const { id } = req.params;
    const { fecha_visita, numero_visitantes, comentarios, museo_id, usuario_id } = req.body;

    const visita = await Visita.findById(id);
    if (!visita) {
      return res.status(404).json({ message: 'Visita no encontrada.' });
    }

    if (museo_id) {
      const museo = await Museo.findById(museo_id);
      if (!museo) {
        return res.status(404).json({ error: 'Museo no encontrado.' });
      }
      visita.museo_id = museo_id;
    }

    if (usuario_id) {
      const usuario = await Usuario.findById(usuario_id);
      if (!usuario) {
        return res.status(404).json({ error: 'Usuario no encontrado.' });
      }
      visita.usuario_id = usuario_id;
    }

    if (fecha_visita) visita.fecha_visita = fecha_visita;
    if (numero_visitantes) visita.numero_visitantes = numero_visitantes;
    if (comentarios) visita.comentarios = comentarios;

    await visita.save();

    return res.status(200).json({ message: 'Visita actualizada.', visita });
  } catch (error) {
    return res.status(500).json({ error: 'Error al actualizar la visita.', details: error.message });
  }
};

/**
 * Eliminar una visita
 */
const deleteVisita = async (req, res) => {
  try {
    const { id } = req.params;

    const visita = await Visita.findByIdAndDelete(id);
    if (!visita) {
      return res.status(404).json({ message: 'Visita no encontrada.' });
    }

    return res.status(200).json({ message: 'Visita eliminada exitosamente.' });
  } catch (error) {
    return res.status(500).json({ error: 'Error al eliminar la visita.', details: error.message });
  }
};

module.exports = {
  createVisita,
  getVisitas,
  getVisitaById,
  updateVisita,
  deleteVisita,
};
