
const mongoose = require('mongoose');

// Esquema del producto
const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,  // El nombre del producto es obligatorio
        trim: true
    },
    price: {
        type: Number,
        required: true,  // El precio es obligatorio
        min: 0  // El precio no puede ser negativo
    },
    category: {
        type: String,
        required: true,  // La categoría es obligatoria
        trim: true
    }
}, { timestamps: true });  // Esto agrega automáticamente los campos 'createdAt' y 'updatedAt'


const Product = mongoose.model('Product', productSchema);

module.exports = Product;
