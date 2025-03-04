
const express = require('express');
const Cart = require('../models/cart');  // Importa el modelo de Carrito
const Product = require('../models/product');  // Importa el modelo de Producto
const router = express.Router();

// Ruta GET para obtener un carrito por ID
router.get('/:cid', async (req, res) => {
    const { cid } = req.params;

    try {
        const cart = await Cart.findById(cid).populate('products.product');
        if (!cart) {
            return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });
        }
        res.json({ status: 'success', payload: cart });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Error al obtener el carrito' });
    }
});

// Ruta POST para crear un carrito nuevo
router.post('/', async (req, res) => {
    try {
        const newCart = new Cart({ products: [] });
        await newCart.save();
        res.status(201).json({ status: 'success', payload: newCart });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Error al crear el carrito' });
    }
});

// Ruta PUT para actualizar un carrito con productos
router.put('/:cid', async (req, res) => {
    const { cid } = req.params;
    const { products } = req.body;

    try {
        const updatedCart = await Cart.findByIdAndUpdate(cid, { products }, { new: true });
        if (!updatedCart) {
            return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });
        }
        res.json({ status: 'success', payload: updatedCart });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Error al actualizar el carrito' });
    }
});

// Ruta PUT para actualizar la cantidad de un producto específico en el carrito
router.put('/:cid/products/:pid', async (req, res) => {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    try {
        const cart = await Cart.findById(cid);
        if (!cart) {
            return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });
        }

        const productIndex = cart.products.findIndex(p => p.product.toString() === pid);
        if (productIndex === -1) {
            return res.status(404).json({ status: 'error', message: 'Producto no encontrado en el carrito' });
        }

        cart.products[productIndex].quantity = quantity;
        await cart.save();

        res.json({ status: 'success', payload: cart });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Error al actualizar la cantidad del producto en el carrito' });
    }
});

// Ruta DELETE para eliminar un producto del carrito
router.delete('/:cid/products/:pid', async (req, res) => {
    const { cid, pid } = req.params;

    try {
        const cart = await Cart.findById(cid);
        if (!cart) {
            return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });
        }

        cart.products = cart.products.filter(p => p.product.toString() !== pid);
        await cart.save();

        res.json({ status: 'success', message: 'Producto eliminado del carrito' });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Error al eliminar el producto del carrito' });
    }
});

// Ruta DELETE para vaciar un carrito (eliminar todos los productos)
router.delete('/:cid', async (req, res) => {
    const { cid } = req.params;

    try {
        const cart = await Cart.findById(cid);
        if (!cart) {
            return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });
        }

        cart.products = [];
        await cart.save();

        res.json({ status: 'success', message: 'Carrito vacío' });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Error al vaciar el carrito' });
    }
});

module.exports = router;
