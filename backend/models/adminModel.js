const mongoose = require('mongoose');

// Definición del esquema de Mongoose
const adminSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre es obligatorio'],
    maxlength: [30, 'El nombre no puede tener más de 30 caracteres'],
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
}, {
  collection: 'admin',
  timestamps: false,
});

// Middleware para manejar errores de índice único
adminSchema.post('save', function (error, doc, next) {
  if (error.name === 'MongoServerError' && error.code === 11000) {
    next(new Error('El correo electrónico ya está registrado'));
  } else {
    next(error);
  }
});

const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;
