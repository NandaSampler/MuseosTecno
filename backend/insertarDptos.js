require('dotenv').config(); // Cargar variables de entorno
const mongoose = require('./db'); // Conexión configurada
const Dpto = require('./models/dptoModel'); // Modelo de Departamento

// Función para insertar los departamentos de Bolivia
const insertDepartamentos = async () => {
  try {
    // Lista de departamentos
    const departamentos = [
      { nombre: 'La Paz' },
      { nombre: 'Cochabamba' },
      { nombre: 'Santa Cruz' },
      { nombre: 'Chuquisaca' },
      { nombre: 'Oruro' },
      { nombre: 'Potosí' },
      { nombre: 'Tarija' },
      { nombre: 'Beni' },
      { nombre: 'Pando' },
    ];

    // Eliminar todos los registros previos (opcional, para evitar duplicados)
    await Dpto.deleteMany();

    // Insertar los nuevos departamentos
    const resultados = await Dpto.insertMany(departamentos);

    console.log('✅ Departamentos insertados correctamente:');
    resultados.forEach((d) => {
      console.log(`- ${d.nombre} (ID: ${d._id})`);
    });
  } catch (error) {
    console.error('❌ Error al insertar los departamentos:', error.message);
  } finally {
    mongoose.connection.close();
  }
};

// Ejecutar el script
insertDepartamentos();
