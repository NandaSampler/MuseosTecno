require('dotenv').config();
const mongoose = require('./db');
const Horario = require('./models/horarioModel');

console.log('⏳ Iniciando inserción de horarios...');

const insertHorarios = async () => {
  try {
    const museoId = '6816dddf20bd20a8fb270c0d';

    const horarios = [
      { dia_semana: 'Lunes', hora_apertura: '09:00:00', hora_cierre: '17:00:00', museo_id: museoId },
      { dia_semana: 'Martes', hora_apertura: '09:00:00', hora_cierre: '17:00:00', museo_id: museoId },
      { dia_semana: 'Miércoles', hora_apertura: '09:00:00', hora_cierre: '17:00:00', museo_id: museoId },
      { dia_semana: 'Jueves', hora_apertura: '09:00:00', hora_cierre: '17:00:00', museo_id: museoId },
      { dia_semana: 'Viernes', hora_apertura: '09:00:00', hora_cierre: '17:00:00', museo_id: museoId },
      { dia_semana: 'Sábado', hora_apertura: '10:00:00', hora_cierre: '14:00:00', museo_id: museoId },
      { dia_semana: 'Feriado', hora_apertura: '10:00:00', hora_cierre: '13:00:00', museo_id: museoId },
    ];

    const resultados = await Horario.insertMany(horarios);

    console.log('✅ Horarios insertados correctamente:');
    resultados.forEach((horario) => {
      console.log(`- ${horario.dia_semana}: ${horario.hora_apertura} - ${horario.hora_cierre}`);
    });
  } catch (error) {
    console.error('❌ Error al insertar los horarios:', error);
  } finally {
    mongoose.connection.close();
    console.log('🔚 Conexión cerrada.');
  }
};

insertHorarios();
console.log('📌 insertHorarios fue llamado');
