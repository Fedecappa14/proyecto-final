
const express = require('express');
const Product = require('../models/product');  // Importa el modelo de Producto
const router = express.Router();

// Ruta GET para obtener productos con filtros, paginación y ordenamiento
router.get('/', async (req, res) => {
    const { limit = 10, page = 1, sort = 'asc', query } = req.query;
    const queryConditions = {};

    if (query) {
        queryConditions.name = { $regex: query, $options: 'i' }; // Filtro por nombre (insensible a mayúsculas/minúsculas)
    }

    try {
        const products = await Product.find(queryConditions)
            .limit(Number(limit))
            .skip((page - 1) * limit)
            .sort({ price: sort === 'asc' ? 1 : -1 });

        const totalProducts = await Product.countDocuments(queryConditions);
        const totalPages = Math.ceil(totalProducts / limit);

        res.json({
            status: 'success',
            payload: products,
            totalPages,
            prevPage: page > 1 ? Number(page) - 1 : null,
            nextPage: page < totalPages ? Number(page) + 1 : null,
            page: Number(page),
            hasPrevPage: page > 1,
            hasNextPage: page < totalPages,
            prevLink: page > 1 ? `/products?limit=${limit}&page=${page - 1}&query=${query}&sort=${sort}` : null,
            nextLink: page < totalPages ? `/products?limit=${limit}&page=${page + 1}&query=${query}&sort=${sort}` : null
        });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Error al obtener productos' });
    }
});

// Ruta POST para agregar un producto nuevo
router.post('/', async (req, res) => {
    const { name, price, category } = req.body;

    if (!name || !price || !category) {
        return res.status(400).json({ status: 'error', message: 'Faltan datos del producto' });
    }

    try {
        const newProduct = new Product({ name, price, category });
        await newProduct.save();
        res.status(201).json({ status: 'success', payload: newProduct });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Error al agregar el producto' });
    }
});

// Ruta PUT para actualizar un producto por ID
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { name, price, category } = req.body;

    try {
        const updatedProduct = await Product.findByIdAndUpdate(id, { name, price, category }, { new: true });
        if (!updatedProduct) {
            return res.status(404).json({ status: 'error', message: 'Producto no encontrado' });
        }
        res.json({ status: 'success', payload: updatedProduct });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Error al actualizar el producto' });
    }
});

// Ruta DELETE para eliminar un producto por ID
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const deletedProduct = await Product.findByIdAndDelete(id);
        if (!deletedProduct) {
            return res.status(404).json({ status: 'error', message: 'Producto no encontrado' });
        }
        res.json({ status: 'success', message: 'Producto eliminado' });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Error al eliminar el producto' });
    }
});

module.exports = router;
