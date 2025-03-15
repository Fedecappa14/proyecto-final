const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('../models/product');
const Cart = require('../models/cart');

dotenv.config(); 

// Conectar a MongoDB Atlas
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("✅ Conectado a MongoDB Atlas. Poblando datos...");
}).catch(err => {
    console.error("❌ Error al conectar a MongoDB:", err);
});

// Datos de productos
const productos = [
    { name: "Remera Negra", price: 25.99, stock: 10, category: "Ropa" },
    { name: "Campera de Cuero", price: 89.99, stock: 5, category: "Ropa" },
    { name: "Zapatillas Urbanas", price: 49.99, stock: 8, category: "Calzado" },
    { name: "Gorra Street", price: 15.99, stock: 12, category: "Accesorios" },
    { name: "Mochila Casual", price: 39.99, stock: 6, category: "Accesorios" }
];

// Datos de carritos (cada carrito con productos aleatorios)
const carritos = [
    { products: [{ productId: null, quantity: 2 }] },
    { products: [{ productId: null, quantity: 1 }] },
    { products: [{ productId: null, quantity: 3 }] },
    { products: [{ productId: null, quantity: 1 }] },
    { products: [{ productId: null, quantity: 4 }] }
];

// Función para poblar la base de datos
const seedDatabase = async () => {
    try {
        // Borrar datos 
        await Product.deleteMany({});
        await Cart.deleteMany({});
        
        // Insertar productos
        const productosInsertados = await Product.insertMany(productos);
        console.log("✅ Productos insertados:", productosInsertados);

        // Asignar productos a los carritos
        carritos.forEach(cart => {
            cart.products[0].productId = productosInsertados[Math.floor(Math.random() * productosInsertados.length)]._id;
        });

        // Insertar carritos
        const carritosInsertados = await Cart.insertMany(carritos);
        console.log("✅ Carritos insertados:", carritosInsertados);

        // Cerrar conexión
        mongoose.connection.close();
        console.log("✅ Base de datos poblada correctamente.");
    } catch (error) {
        console.error("❌ Error poblando la base de datos:", error);
        mongoose.connection.close();
    }
};

// Ejecutar la función
seedDatabase();