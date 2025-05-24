require('dotenv').config(); // Cargar variables de entorno
const mongoose = require('./db'); // Conexión a MongoDB
const Horario = require('./models/horarioModel'); // Modelo de Horario

const insertHorarios = async () => {
  try {
    // Lista de horarios para los museos (usamos fechas fijas representando días de semana)
    const horarios = [
      // Museo 1
      {
        museo_id: '6816dddf20bd20a8fb270c0d',
        dia_semana: new Date('2023-01-02'), // Lunes
        hora_apertura: '09:00:00',
        hora_cierre: '17:00:00',
      },
      {
        museo_id: '6816dddf20bd20a8fb270c0d',
        dia_semana: new Date('2023-01-03'), // Martes
        hora_apertura: '09:00:00',
        hora_cierre: '17:00:00',
      },
      // Museo 2
      {
        museo_id: '6816dddf20bd20a8fb270c0e',
        dia_semana: new Date('2023-01-02'),
        hora_apertura: '10:00:00',
        hora_cierre: '18:00:00',
      },
      {
        museo_id: '6816dddf20bd20a8fb270c0e',
        dia_semana: new Date('2023-01-03'),
        hora_apertura: '10:00:00',
        hora_cierre: '18:00:00',
      },
      // Museo 3
      {
        museo_id: '6816dddf20bd20a8fb270c0f',
        dia_semana: new Date('2023-01-02'),
        hora_apertura: '08:30:00',
        hora_cierre: '16:30:00',
      },
      {
        museo_id: '6816dddf20bd20a8fb270c0f',
        dia_semana: new Date('2023-01-03'),
        hora_apertura: '08:30:00',
        hora_cierre: '16:30:00',
      },
    ];

    // Eliminar horarios anteriores (opcional)
    // await Horario.deleteMany();

    // Insertar horarios
    const resultados = await Horario.insertMany(horarios);

    console.log('✅ Horarios insertados correctamente:');
    resultados.forEach((h) => {
      console.log(`- Museo ID: ${h.museo_id} | Día: ${h.dia_semana.toDateString()} | ${h.hora_apertura} - ${h.hora_cierre}`);
    });
  } catch (error) {
    console.error('❌ Error al insertar los horarios:', error.message);
  } finally {
    mongoose.connection.close();
  }
};

// Ejecutar
insertHorarios();
