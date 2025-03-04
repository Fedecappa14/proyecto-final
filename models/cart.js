
const mongoose = require('mongoose');

// Esquema del carrito
const cartSchema = new mongoose.Schema({
    products: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',  // Referencia al modelo de Producto
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            min: 1  // La cantidad mínima de productos en un carrito es 1
        }
    }]
}, { timestamps: true });  // Esto agrega automáticamente los campos 'createdAt' y 'updatedAt'

// Creamos el modelo a partir del esquema
const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
