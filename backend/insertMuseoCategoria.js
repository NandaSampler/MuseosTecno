require('dotenv').config(); // Cargar variables de entorno
const mongoose = require('./db'); // Conexión a MongoDB
const MuseoCategoria = require('./models/museoCategoriaModel'); // Modelo de MuseoCategoria

const insertMuseoCategorias = async () => {
  try {
    // Lista de relaciones entre museos y categorías
    const relaciones = [
      {
        museo_id: '6816dddf20bd20a8fb270c0f',     // ID del museo
        categoria_id: '68179617a202d63b3be7e347', // ID de la categoría
      },
    ];

    // Eliminar relaciones previas si lo deseas
    // await MuseoCategoria.deleteMany();

    // Insertar nuevas relaciones
    const resultados = await MuseoCategoria.insertMany(relaciones);

    console.log('✅ Relaciones museo-categoría insertadas correctamente:');
    resultados.forEach((rel) => {
      console.log(`- Museo ID: ${rel.museo_id} -> Categoría ID: ${rel.categoria_id}`);
    });
  } catch (error) {
    console.error('❌ Error al insertar las relaciones:', error.message);
  } finally {
    mongoose.connection.close();
  }
};

// Ejecutar
insertMuseoCategorias();
