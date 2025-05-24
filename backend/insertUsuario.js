require('dotenv').config(); // Cargar variables de entorno
const mongoose = require('./db'); // Conexión a MongoDB
const Admin = require('./models/adminModel'); // Modelo de Admin
const Museo = require('./models/museoModel');
const bcrypt = require('bcrypt'); // Modelo de Museo

const insertAdmins = async () => {
  try {
    // Obtener los museos existentes (puedes usar un filtro si solo quieres algunos)
    const museos = await Museo.find();

    if (museos.length === 0) {
      throw new Error('No se encontraron museos en la base de datos');
    }
    const passwordPlano = 'admin123';
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(passwordPlano, salt);
    // Crear administradores relacionados con museos
    const admins = [
      {
        nombre: 'Mateo',
        apellido: 'Valenzuela',
        email: 'mateo.valenzuela@ucb.edu.bo',
        password: hashedPassword,
        rol: 'superadmin',
        museo_id: museos.find(m => m.nombre.includes('Arte'))._id,
      }
    ];

    // Insertar los administradores
    const resultados = await Admin.insertMany(admins);

    console.log('✅ Administradores insertados correctamente:');
    resultados.forEach((admin) => {
      console.log(`- ${admin.nombre} ${admin.apellido} (Email: ${admin.email})`);
    });
  } catch (error) {
    console.error('❌ Error al insertar los administradores:', error.message);
  } finally {
    mongoose.connection.close();
  }
};

// Ejecutar
insertAdmins();
