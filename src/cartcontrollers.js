const Cart = require('../models/cart'); // Modelo de Carrito
const Product = require('../models/product'); // Modelo de Producto

// Función para obtener los productos de un carrito específico
const getCartById = async (req, res) => {
    try {
        const { cid } = req.params;
        const cart = await Cart.findById(cid).populate('products.product'); // Poblamos los productos con sus datos completos

        if (!cart) {
            return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });
        }

        res.json({ status: 'success', payload: cart });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: 'error', message: 'Error al obtener el carrito' });
    }
};

// Función para agregar productos al carrito
const addProductToCart = async (req, res) => {
    try {
        const { cid } = req.params;
        const { pid, quantity } = req.body;

        // Validamos si el producto existe
        const product = await Product.findById(pid);
        if (!product) {
            return res.status(404).json({ status: 'error', message: 'Producto no encontrado' });
        }

        // Buscamos el carrito
        const cart = await Cart.findById(cid);
        if (!cart) {
            return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });
        }

        // Si el producto ya está en el carrito, actualizamos la cantidad
        const productIndex = cart.products.findIndex((item) => item.product.toString() === pid);
        if (productIndex > -1) {
            cart.products[productIndex].quantity += quantity; // Aumentamos la cantidad
        } else {
            // Si no existe, lo agregamos como nuevo producto
            cart.products.push({ product: pid, quantity });
        }

        await cart.save();
        res.json({ status: 'success', payload: cart });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: 'error', message: 'Error al agregar el producto al carrito' });
    }
};

// Función para eliminar un producto del carrito
const removeProductFromCart = async (req, res) => {
    try {
        const { cid, pid } = req.params;

        // Buscamos el carrito
        const cart = await Cart.findById(cid);
        if (!cart) {
            return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });
        }

        // Buscamos el índice del producto
        const productIndex = cart.products.findIndex((item) => item.product.toString() === pid);
        if (productIndex === -1) {
            return res.status(404).json({ status: 'error', message: 'Producto no encontrado en el carrito' });
        }

        // Eliminamos el producto del carrito
        cart.products.splice(productIndex, 1);
        await cart.save();
        res.json({ status: 'success', payload: cart });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: 'error', message: 'Error al eliminar el producto del carrito' });
    }
};

// Función para vaciar el carrito
const clearCart = async (req, res) => {
    try {
        const { cid } = req.params;

        const cart = await Cart.findById(cid);
        if (!cart) {
            return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });
        }

        cart.products = []; // Vaciar el carrito
        await cart.save();

        res.json({ status: 'success', message: 'Carrito vaciado correctamente' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: 'error', message: 'Error al vaciar el carrito' });
    }
};

module.exports = {
    getCartById,
    addProductToCart,
    removeProductFromCart,
    clearCart
};