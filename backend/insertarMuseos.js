require('dotenv').config(); // Cargar variables de entorno
const mongoose = require('./db'); // Conexión a MongoDB
const Museo = require('./models/museoModel'); // Modelo de Museo

const insertMuseos = async () => {
  try {
    // ID del departamento La Paz
    const departamentoId = '6816d7d3f4d26b0583103d07';

    // Lista de museos
    const museos = [
      {
        nombre: 'Museo Nacional de Arte',
        ubicacion: 'Calle Comercio esquina Socabaya, centro histórico de La Paz',
        historia: 'Inaugurado oficialmente en 1966, el museo se encuentra en un palacio señorial del siglo XVIII que responde al estilo mestizo o barroco andino.',
        descripcion: 'Este museo alberga una importante colección permanente de pintura colonial, incluyendo obras de Melchor Pérez de Holguín y Gregorio Gamarra, así como arte contemporáneo boliviano.',
        foto: 'https://upload.wikimedia.org/wikipedia/commons/6/6f/Museo_Nacional_de_Arte_La_Paz_Bolivia.jpg', // Imagen referencial
        departamento_id: departamentoId,
      },
      {
        nombre: 'Museo Nacional de Etnografía y Folklore (MUSEF)',
        ubicacion: 'Esquina de las calles Ingavi y Jenaro Sanjinés, centro histórico de La Paz',
        historia: 'Fundado en 1962, el MUSEF tiene sus raíces en el Departamento Científico de Etnografía creado en 1925.',
        descripcion: 'El museo posee un patrimonio compuesto por 30.000 bienes culturales, incluyendo máscaras, cerámica, tejidos y arte plumario, representando la diversidad cultural de Bolivia.',
        foto: 'https://upload.wikimedia.org/wikipedia/commons/e/e4/MUSEF_La_Paz_Bolivia.jpg',
        departamento_id: departamentoId,
      },
      {
        nombre: 'Museo de Metales Preciosos Precolombinos (Museo del Oro)',
        ubicacion: 'Calle Jaén Nº 777, zona norte de La Paz',
        historia: 'Inaugurado el 15 de julio de 1983, el museo se encuentra en una casona que perteneció a Apolinar Jaén, prócer de la independencia.',
        descripcion: 'El museo exhibe piezas de orfebrería y cerámica de la época precolombina, incluyendo objetos de oro y plata de culturas como la incaica, aymara y tiwanaku.',
        foto: 'https://upload.wikimedia.org/wikipedia/commons/5/5e/Museo_del_Oro_La_Paz_Bolivia.jpg',
        departamento_id: departamentoId,
      },
    ];

    // Eliminar museos anteriores si es necesario
    // await Museo.deleteMany();

    // Insertar los museos
    const resultados = await Museo.insertMany(museos);

    console.log('✅ Museos insertados correctamente:');
    resultados.forEach((museo) => {
      console.log(`- ${museo.nombre} (ID: ${museo._id})`);
    });
  } catch (error) {
    console.error('❌ Error al insertar los museos:', error.message);
  } finally {
    mongoose.connection.close();
  }
};

// Ejecutar
insertMuseos();
