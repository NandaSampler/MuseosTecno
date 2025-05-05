const mongoose = require('mongoose');

// Definición del esquema de Usuario
const usuarioSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre es obligatorio'],
    maxlength: [50, 'El nombre no puede tener más de 50 caracteres'],
    trim: true,
  },
  apellido: {
    type: String,
    required: [true, 'El apellido es obligatorio'],
    maxlength: [50, 'El apellido no puede tener más de 50 caracteres'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'El correo electrónico es obligatorio'],
    unique: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'El formato del correo electrónico es inválido'],
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: [true, 'La contraseña es obligatoria'],
    minlength: [6, 'La contraseña debe tener al menos 6 caracteres'],
  },
  //////////////////////////////ADVERTENCIA ABAJO
  favoritos: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Museo', // Relación con los museos favoritos //OJO ESTO  NO SE SI ESTÁ BIEN CREO QUE NO MI GENTE LATINO
  }],
}, {
  collection: 'usuario',
  timestamps: false,
});

// Middleware para manejar errores de índice único
usuarioSchema.post('save', function (error, doc, next) {
  if (error.name === 'MongoServerError' && error.code === 11000) {
    next(new Error('El correo electrónico ya está registrado'));
  } else {
    next(error);
  }
});

const Usuario = mongoose.model('Usuario', usuarioSchema);
module.exports = Usuario;
