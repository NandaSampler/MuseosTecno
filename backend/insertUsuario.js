require('dotenv').config(); // Cargar variables de entorno
const mongoose = require('./db'); // Conexión configurada en db.js
const Usuario = require('./models/usuarioModel'); // Modelo de Usuario
const bcrypt = require('bcrypt'); // Para encriptar la contraseña

// Función para insertar un nuevo usuario
const insertUsuario = async () => {
  try {
    // Encriptar la contraseña
    const passwordPlano = 'usuario123';
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(passwordPlano, salt);

    // Crear el nuevo usuario
    const nuevoUsuario = new Usuario({
      nombre: 'Ana Lopez',
      email: 'ana.lopez@example.com',
      password: hashedPassword,
      favoritos: [], // Puedes agregar IDs de museos si ya tienes
    });

    // Guardar en la base de datos
    await nuevoUsuario.save();

    console.log('✅ Usuario insertado exitosamente:', nuevoUsuario);
  } catch (error) {
    console.error('❌ Error al insertar el usuario:', error.message);
  } finally {
    // Cerrar la conexión a la base de datos
    mongoose.connection.close();
  }
};

// Ejecutar la función
insertUsuario();
