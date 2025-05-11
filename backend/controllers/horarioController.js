const Horario = require('../models/horarioModel');
const Museo = require('../models/museoModel');

/**
 * Crear un nuevo horario
 */
const createHorario = async (req, res) => {
  try {
    const { dia_semana, hora_apertura, hora_cierre, museo_id } = req.body;

    if (!dia_semana || !hora_apertura || !hora_cierre || !museo_id) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
    }

    const museo = await Museo.findById(museo_id);
    if (!museo) {
      return res.status(404).json({ error: 'Museo no encontrado.' });
    }

    const yaExiste = await Horario.findOne({ dia_semana, museo_id });
    if (yaExiste) {
      return res.status(409).json({ error: `El horario para ${dia_semana} ya está registrado.` });
    }

    const nuevoHorario = new Horario({
      dia_semana,
      hora_apertura,
      hora_cierre,
      museo_id,
    });

    await nuevoHorario.save();
    return res.status(201).json({ message: 'Horario creado exitosamente.', horario: nuevoHorario });
  } catch (error) {
    return res.status(500).json({ error: 'Error al crear el horario.', details: error.message });
  }
};

/**
 * Obtener todos los horarios
 */
const getHorarios = async (req, res) => {
  try {
    const horarios = await Horario.find().populate('museo_id');
    return res.status(200).json(horarios);
  } catch (error) {
    return res.status(500).json({ error: 'Error al obtener los horarios.', details: error.message });
  }
};

/**
 * Obtener incluso los días en los que está cerrado.
 */
const getHorariosCompletosPorMuseo = async (req, res) => {
  try {
    console.log("📥 Entrando a getHorariosCompletosPorMuseo");
console.log("🔎 museoId recibido:", req.params.museoId);

    const { museoId } = req.params;
    const diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo', 'Feriado'];

    const horarios = await Horario.find({ museo_id: museoId });

    const completos = diasSemana.map(dia => {
      const h = horarios.find(hor => hor.dia_semana === dia);
      console.log("🔎 ID recibido:", museoId);
console.log("🧾 Horarios encontrados en la base de datos:", horarios);
console.log("✅ Entrando a getHorariosCompletosPorMuseo");


      return {
        dia,
        apertura: h?.hora_apertura || null,
        cierre: h?.hora_cierre || null,
        cerrado: !h
      };
    });

    return res.status(200).json(completos);
  } catch (error) {
    return res.status(500).json({ error: 'Error al obtener los horarios completos.', details: error.message });
  }
};


/**
 * Obtener un horario por ID
 */
const getHorarioById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ error: 'ID de horario no válido.' });
    }

    const horario = await Horario.findById(id).populate('museo_id');
    if (!horario) {
      return res.status(404).json({ message: 'Horario no encontrado.' });
    }

    return res.status(200).json(horario);
  } catch (error) {
    return res.status(500).json({ error: 'Error al obtener el horario.', details: error.message });
  }
};

/**
 * Actualizar un horario
 */
const updateHorario = async (req, res) => {
  try {
    const { id } = req.params;
    const { dia_semana, hora_apertura, hora_cierre, museo_id } = req.body;

    const horario = await Horario.findById(id);
    if (!horario) {
      return res.status(404).json({ message: 'Horario no encontrado.' });
    }

    if (dia_semana) horario.dia_semana = dia_semana;
    if (hora_apertura) horario.hora_apertura = hora_apertura;
    if (hora_cierre) horario.hora_cierre = hora_cierre;

    if (museo_id) {
      const museo = await Museo.findById(museo_id);
      if (!museo) {
        return res.status(404).json({ error: 'Museo no encontrado.' });
      }
      horario.museo_id = museo_id;
    }

    await horario.save();
    return res.status(200).json({ message: 'Horario actualizado.', horario });
  } catch (error) {
    return res.status(500).json({ error: 'Error al actualizar el horario.', details: error.message });
  }
};

/**
 * Eliminar un horario
 */
const deleteHorario = async (req, res) => {
  try {
    const { id } = req.params;

    const horario = await Horario.findByIdAndDelete(id);
    if (!horario) {
      return res.status(404).json({ message: 'Horario no encontrado.' });
    }

    return res.status(200).json({ message: 'Horario eliminado exitosamente.' });
  } catch (error) {
    return res.status(500).json({ error: 'Error al eliminar el horario.', details: error.message });
  }
};

module.exports = {
  createHorario,
  getHorarios,
  getHorarioById,
  updateHorario,
  deleteHorario,
  getHorariosCompletosPorMuseo,
};
