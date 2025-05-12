require('dotenv').config(); // Variables de entorno
const mongoose = require('./db'); // Conexión a MongoDB
const Museo = require('./models/museoModel'); // Modelo de Museo

const agregarCampoEstado = async () => {
  try {
    const resultado = await Museo.updateMany(
      { estado: { $exists: false } }, // Solo los que no tienen 'estado'
      { $set: { estado: 'aceptado' } } // Les asignamos 'aceptado'
    );

    console.log(`✅ Museos actualizados: ${resultado.modifiedCount}`);
  } catch (error) {
    console.error('❌ Error al actualizar los museos:', error.message);
  } finally {
    mongoose.connection.close();
  }
};

agregarCampoEstado();
