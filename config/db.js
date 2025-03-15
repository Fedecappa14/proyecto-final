const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    //conexión de MongoDB Atlas del archivo .env
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Conectado a MongoDB Atlas');
  } catch (err) {
    console.error('Error al conectar a MongoDB:', err);
    process.exit(1); 
  }
};

module.exports = connectDB;