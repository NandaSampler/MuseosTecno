require('dotenv').config();
const mongoose = require('./db'); // Conexión a MongoDB

const Usuario = require('./models/usuarioModel');
const Museo = require('./models/museoModel'); // <-- Esto es lo que faltaba

const listarUsuarios = async () => {
  try {
    const usuarios = await Usuario.find().populate('favoritos', 'nombre'); // 'nombre' del museo

    if (usuarios.length === 0) {
      console.log('⚠️ No hay usuarios registrados.');
    } else {
      console.log('📋 Lista de usuarios:');
      usuarios.forEach((usuario, index) => {
        console.log(`\n#${index + 1}`);
        console.log(`ID: ${usuario._id}`);
        console.log(`Nombre: ${usuario.nombre}`);
        console.log(`Email: ${usuario.email}`);
        console.log(`Favoritos: ${usuario.favoritos.map(m => m.nombre).join(', ') || 'Ninguno'}`);
      });
    }
  } catch (error) {
    console.error('❌ Error al listar usuarios:', error.message);
  } finally {
    mongoose.connection.close();
  }
};

listarUsuarios();
