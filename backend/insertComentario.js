require('dotenv').config(); // Cargar variables de entorno
const mongoose = require('./db'); // Conexión a MongoDB
const Comentario = require('./models/comentarioModel'); // Modelo de Comentario

const insertComentario = async () => {
  try {
    const comentario = {
      comentario: "No me gustó para nada.",
      valoracion: 1,
      usuario_id: '681900d8ae11420d41de7839', // ID de usuario existente
      museo_id: '6816dddf20bd20a8fb270c0d',   // ID del museo existente
    };

    const nuevoComentario = await Comentario.create(comentario);
    console.log('✅ Comentario insertado con éxito:', nuevoComentario);
  } catch (error) {
    console.error('❌ Error al insertar el comentario:', error.message);
  } finally {
    mongoose.connection.close();
  }
};

// Ejecutar
insertComentario();
