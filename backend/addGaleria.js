require('dotenv').config(); // Cargar variables de entorno
const mongoose = require('./db'); // Conexión a MongoDB
const Museo = require('./models/museoModel'); // Modelo de Museo

const addImagenesToGaleria = async () => {
  try {
    const museoId = '6816dddf20bd20a8fb270c0d';

    const nuevasImagenes = [
      'https://bicentenario.bo/wp-content/uploads/2025/01/images-44.jpg',
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQtU9UjmGWQ0fzKekEml7m66NuIf9_loKvEiU9Be6Yh9a-9av5uSyz3syWRD6-NtuIs9wo&usqp=CAU',
    ];

    const museo = await Museo.findById(museoId);
    if (!museo) {
      return console.error('❌ Museo no encontrado.');
    }

    // Asegurarse de que la galería existe
    if (!Array.isArray(museo.galeria)) {
      museo.galeria = [];
    }

    // Evitar duplicados
    nuevasImagenes.forEach((img) => {
      if (!museo.galeria.includes(img)) {
        museo.galeria.push(img);
      }
    });

    await museo.save();

    console.log('✅ Imágenes añadidas correctamente a la galería:');
    console.log(museo.galeria);
  } catch (error) {
    console.error('❌ Error al añadir imágenes:', error.message);
  } finally {
    mongoose.connection.close();
  }
};

addImagenesToGaleria();
