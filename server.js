const express = require('express');
const mongoose = require('./config/db');
const http = require('http');
const socketIo = require('socket.io');
const Product = require('./models/product');
const productRoutes = require('./routes/products'); // Importa tus rutas de productos

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Conectar a MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Conectado a MongoDB Atlas'))
  .catch(err => console.log('Error al conectar a MongoDB:', err));

// Middlewares
app.use(express.static('public'));
app.use(express.json());


app.use('/api/products', productRoutes); 

io.on('connection', (socket) => {
  console.log('Nuevo cliente conectado');

  
  Product.find()
    .then(products => {
      socket.emit('productList', products); 
    })
    .catch(err => console.log('Error al obtener productos:', err));

  // sockets
  socket.on('addProduct', (productData) => {
    const newProduct = new Product({
      name: productData.name,
    });

    newProduct.save()
      .then(() => {
        Product.find()
          .then(products => {
            io.emit('productList', products); // Actualiza a todos los clientes
          });
      })
      .catch(err => console.log('Error al guardar producto:', err));
  });

  // Cuando el cliente se desconecta
  socket.on('disconnect', () => {
    console.log('Cliente desconectado');
  });
});

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});