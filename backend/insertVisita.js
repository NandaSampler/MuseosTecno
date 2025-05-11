require('dotenv').config(); // Cargar variables de entorno
const mongoose = require('./db'); // Conexión a MongoDB
const Visita = require('./models/visitaModel'); // Modelo de Visita

const insertVisita = async () => {
  try {
    const visita = {
      fecha_hora_visita: new Date('2025-05-12T15:30:00'), // Fecha y hora exacta de la visita
      numero_visitantes: 3,
      nota: 'Por favor, necesitamos acceso para silla de ruedas.',
      guia: true,
      idioma_guia: 'Inglés',
      usuario_id: '681900d8ae11420d41de7839', // ID de usuario existente
      museo_id: '6816dddf20bd20a8fb270c0d'    // ID de museo existente
    };

    const nuevaVisita = await Visita.create(visita);
    console.log('✅ Visita insertada con éxito:', nuevaVisita);
  } catch (error) {
    console.error('❌ Error al insertar la visita:', error.message);
  } finally {
    mongoose.connection.close();
  }
};

// Ejecutar
insertVisita();
