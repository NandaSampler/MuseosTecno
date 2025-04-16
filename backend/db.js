const mongoose = require('mongoose');
require('dotenv').config();

const mongoUri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.xknfnt2.mongodb.net/${process.env.MONGO_DATABASE}?retryWrites=true&w=majority&tls=true&appName=Cluster0`;


mongoose.connect(mongoUri)
  .then(() => console.log('✅ Conectado a MongoDB Atlas'))
  .catch((err) => console.error('❌ Error al conectar con MongoDB:', err));


module.exports = mongoose;
