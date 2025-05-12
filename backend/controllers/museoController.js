const Museo = require('../models/museoModel');
const Dpto = require('../models/dptoModel');
const Horario = require('../models/horarioModel');
const MuseoCategoria = require('../models/museoCategoriaModel');

/**
 * Crear un nuevo museo (ahora usando multer y datos relacionados)
 */
const createMuseo = async (req, res) => {
  try {
    const {
      nombre,
      ubicacion,
      historia,
      descripcion,
      departamento_id
    } = req.body;

    // Archivos
    const foto = req.files?.['foto']?.[0]?.filename || null;
    const galeria = req.files?.['galeria']?.map((file) => file.filename) || [];

    // Validación principal
    if (!nombre || !ubicacion || !historia || !descripcion || !foto || !departamento_id) {
      return res.status(400).json({ error: 'Faltan campos obligatorios.' });
    }

    // Verifica que el departamento exista
    const dpto = await Dpto.findById(departamento_id);
    if (!dpto) {
      return res.status(404).json({ error: 'Departamento no encontrado.' });
    }

    // Crea el museo principal
    const nuevoMuseo = new Museo({
      nombre,
      ubicacion,
      historia,
      descripcion,
      foto,
      galeria,
      departamento_id
    });

    await nuevoMuseo.save();

    // --- Manejo de CATEGORÍAS ---
    if (req.body.categorias) {
      const categoriasArray = JSON.parse(req.body.categorias);
      for (const categoria_id of categoriasArray) {
        await new MuseoCategoria({
          museo_id: nuevoMuseo._id,
          categoria_id
        }).save();
      }
    }

    // --- Manejo de HORARIOS ---
    if (req.body.horarios) {
      const horariosArray = JSON.parse(req.body.horarios);
      for (const h of horariosArray) {
        await new Horario({
          dia_semana: h.dia,
          hora_apertura: h.cerrado ? null : h.apertura,
          hora_cierre: h.cerrado ? null : h.cierre,
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
    if (ubicacion) museo.ubicacion = ubicacion;
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
  deleteMuseo
};