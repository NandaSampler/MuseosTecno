const axios = require("axios");
const Museo = require('../models/museoModel');
const Dpto = require('../models/dptoModel');
const Horario = require('../models/horarioModel');
const MuseoCategoria = require('../models/museoCategoriaModel');
const obtenerCoordenadas = require('../utils/geocoding');

/**
 * Crear un nuevo museo (usando multer y datos relacionados)
 */
const createMuseo = async (req, res) => {
  try {
    // Log de req.body para verificar datos recibidos
    console.log('REQ.BODY createMuseo:', req.body);

    const { nombre, ubicacion, historia, descripcion, departamento_id } = req.body;

    const foto = req.files?.['foto']?.[0]?.filename || null;
    const galeria = req.files?.['galeria']?.map(file => file.filename) || [];

    if (!nombre || !ubicacion || !historia || !descripcion || !foto || !departamento_id) {
      return res.status(400).json({ error: 'Faltan campos obligatorios.' });
    }

    const dpto = await Dpto.findById(departamento_id);
    if (!dpto) {
      return res.status(404).json({ error: 'Departamento no encontrado.' });
    }

    // Obtener lat y lng desde la ubicación
    let lat = null;
    let lng = null;
    if (ubicacion) {
      try {
        const coords = await obtenerCoordenadas(ubicacion);
        lat = coords.lat;
        lng = coords.lng;
      } catch (geoError) {
        console.warn("Advertencia: No se pudieron obtener coordenadas:", geoError.message);
      }
    }

    const nuevoMuseo = new Museo({
      nombre,
      ubicacion,
      historia,
      descripcion,
      foto,
      galeria,
      departamento_id,
      estado: 'pendiente',
      lat,
      lng
    });

    await nuevoMuseo.save();

    // CATEGORÍAS
    if (req.body.categorias) {
      const categoriasArray = JSON.parse(req.body.categorias);
      for (const categoria_id of categoriasArray) {
        await new MuseoCategoria({ museo_id: nuevoMuseo._id, categoria_id }).save();
      }
    }

    // HORARIOS
    if (req.body.horarios) {
      const horariosArray = JSON.parse(req.body.horarios);
      for (const h of horariosArray) {
        await new Horario({
          dia_semana: h.dia,
          hora_apertura: h.cerrado ? null : h.apertura,
          hora_cierre:   h.cerrado ? null : h.cierre,
          museo_id: nuevoMuseo._id
        }).save();
      }
    }

    return res.status(201).json({
      message: 'Museo, categorías y horarios registrados correctamente.',
      museo: nuevoMuseo
    });

  } catch (error) {
    console.error('Error en createMuseo:', error);
    return res.status(500).json({ error: 'Error al crear el museo.', details: error.message });
  }
};

/**
 * Obtener todos los museos
 */
const getMuseos = async (req, res) => {
  try {
    // Paso 1: Obtener todos los museos aceptados con su departamento
    const museos = await Museo.find({ estado: 'aceptado' })
                              .populate('departamento_id')
                              .lean();

    // Paso 2: Obtener todas las relaciones museo-categoría con nombres de categoría
    const relaciones = await MuseoCategoria.find()
      .populate("categoria_id") // Esto nos da acceso al nombre de la categoría
      .lean();

    // Paso 3: Agregar a cada museo su array de nombres de categoría
    const museosConCategorias = museos.map((m) => {
      const categorias = relaciones
        .filter((rel) => rel.museo_id.toString() === m._id.toString())
        .map((rel) => rel.categoria_id?.nombre || "Sin nombre");
      return { ...m, categorias };
    });

    return res.status(200).json(museosConCategorias);
  } catch (error) {
    return res.status(500).json({
      error: 'Error al obtener los museos.',
      details: error.message,
    });
  }
};


/**
 * Obtener museos en estado pendiente (para superadmin)
 */
const getMuseosPendientes = async (req, res) => {
  try {
    const museos = await Museo.find({ estado: 'pendiente' }).populate('departamento_id');
    return res.status(200).json(museos);
  } catch (error) {
    return res.status(500).json({ error: 'Error al obtener museos pendientes.', details: error.message });
  }
};

/**
 * Cambiar estado de un museo: aceptado o rechazado
 */
const cambiarEstadoMuseo = async (req, res) => {
  const { id } = req.params;
  const { nuevoEstado } = req.body;

  if (!['aceptado', 'rechazado'].includes(nuevoEstado)) {
    return res.status(400).json({ error: 'Estado no válido.' });
  }

  try {
    const museo = await Museo.findByIdAndUpdate(id, { estado: nuevoEstado }, { new: true });
    if (!museo) return res.status(404).json({ error: 'Museo no encontrado.' });

    return res.status(200).json({ message: `Museo ${nuevoEstado} exitosamente.`, museo });
  } catch (error) {
    return res.status(500).json({ error: 'Error al cambiar el estado del museo.', details: error.message });
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
    console.log('REQ.BODY updateMuseo:', req.body);
    const { id } = req.params;
    const { nombre, ubicacion, historia, descripcion, foto, departamento_id, galeria } = req.body;

    const museo = await Museo.findById(id);
    if (!museo) {
      return res.status(404).json({ message: 'Museo no encontrado.' });
    }

    if (departamento_id) {
      const dpto = await Dpto.findById(departamento_id);
      if (!dpto) {
        return res.status(404).json({ error: 'Departamento no encontrado.' });
      }
      museo.departamento_id = departamento_id;
    }

    if (nombre) museo.nombre = nombre;
    if (ubicacion) {
      museo.ubicacion = ubicacion;
      try {
        const coords = await obtenerCoordenadas(ubicacion);
        museo.lat = coords.lat;
        museo.lng = coords.lng;
      } catch (geoError) {
        console.warn("No se pudo actualizar lat/lng:", geoError.message);
      }
    }
    if (historia) museo.historia = historia;
    if (descripcion) museo.descripcion = descripcion;
    if (foto) museo.foto = foto;
    if (galeria && Array.isArray(galeria)) museo.galeria = galeria;

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
  getMuseosPendientes,
  cambiarEstadoMuseo
};