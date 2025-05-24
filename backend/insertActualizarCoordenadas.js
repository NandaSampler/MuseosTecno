require('dotenv').config(); // Cargar variables de entorno
const mongoose = require('./db'); // Conexión a MongoDB
const Museo = require('./models/museoModel'); // Modelo del museo
const obtenerCoordenadas = require('./utils/geocoding'); // Función para obtener lat/lng

const actualizarMuseosConCoordenadas = async () => {
  try {
    const museosSinCoords = await Museo.find({
      $or: [{ lat: { $exists: false } }, { lng: { $exists: false } }],
    });

    console.log(`🔍 Museos sin coordenadas: ${museosSinCoords.length}`);

    let actualizados = 0;

    for (const museo of museosSinCoords) {
      try {
        const { lat, lng } = await obtenerCoordenadas(museo.ubicacion);
        museo.lat = lat;
        museo.lng = lng;
        await museo.save();
        console.log(`✅ Coordenadas agregadas para: ${museo.nombre}`);
        actualizados++;
      } catch (error) {
        console.warn(`⚠️ No se pudieron obtener coordenadas para "${museo.nombre}": ${error.message}`);
      }
    }

    console.log(`🎉 Museos actualizados correctamente: ${actualizados}`);
  } catch (error) {
    console.error('❌ Error al actualizar coordenadas:', error.message);
  } finally {
    mongoose.connection.close();
  }
};

actualizarMuseosConCoordenadas();
