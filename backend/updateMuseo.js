require('dotenv').config(); // Cargar variables de entorno
const mongoose = require('./db'); // Tu conexión a MongoDB
const Museo = require('./models/museoModel'); // Modelo del Museo

const updateMuseosWithGaleria = async () => {
  try {
    const resultado = await Museo.updateMany(
      { galeria: { $exists: false } }, // Solo documentos que no tienen 'galeria'
      { $set: { galeria: [] } }         // Añadir el campo con un array vacío
    );

    console.log(`✅ Documentos actualizados: ${resultado.modifiedCount}`);
  } catch (error) {
    console.error('❌ Error al actualizar los museos:', error.message);
  } finally {
    mongoose.connection.close();
  }
};

updateMuseosWithGaleria();
