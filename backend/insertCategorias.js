require('dotenv').config(); // Cargar variables de entorno
const mongoose = require('./db'); // Conexión a MongoDB
const Categoria = require('./models/categoriaModel'); // Modelo de Categoria

const insertCategorias = async () => {
  try {
    // Lista de categorías culturales
    const categorias = [
      { nombre: 'Arte' },
      { nombre: 'Historia' },
      { nombre: 'Arqueología' },
      { nombre: 'Orfebrería' },
      { nombre: 'Musica' },
      { nombre: 'Costumbrista' },
      { nombre: 'Ciencia' },
    ];

    // Eliminar categorías anteriores (opcional)
    // await Categoria.deleteMany();

    // Insertar las nuevas categorías
    const resultados = await Categoria.insertMany(categorias);

    console.log('✅ Categorías insertadas correctamente:');
    resultados.forEach((c) => {
      console.log(`- ${c.nombre} (ID: ${c._id})`);
    });
  } catch (error) {
    console.error('❌ Error al insertar las categorías:', error.message);
  } finally {
    mongoose.connection.close();
  }
};

// Ejecutar
insertCategorias();
