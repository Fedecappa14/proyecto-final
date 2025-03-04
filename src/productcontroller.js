// productController.js
const Product = require('../models/product'); // Modelo de Producto

// Función para obtener productos con filtros, paginación y ordenamiento
const getProducts = async (req, res) => {
    try {
        const { limit = 10, page = 1, sort = 'asc', query = '' } = req.query;

        const filters = {};
        if (query) {
            filters.name = { $regex: query, $options: 'i' }; // Filtra por nombre del producto (case-insensitive)
        }

        // Obtener productos con paginación y ordenamiento
        const products = await Product.find(filters)
            .sort({ price: sort === 'asc' ? 1 : -1 }) // Ordena por precio
            .limit(Number(limit))
            .skip((page - 1) * limit);

        // Obtener el total de productos para la paginación
        const totalProducts = await Product.countDocuments(filters);

        const totalPages = Math.ceil(totalProducts / limit);
        const hasPrevPage = page > 1;
        const hasNextPage = page < totalPages;
        const prevPage = hasPrevPage ? page - 1 : null;
        const nextPage = hasNextPage ? page + 1 : null;

        res.json({
            status: 'success',
            payload: products,
            totalPages,
            prevPage,
            nextPage,
            page,
            hasPrevPage,
            hasNextPage,
            prevLink: hasPrevPage ? `/api/products?page=${prevPage}&limit=${limit}&sort=${sort}&query=${query}` : null,
            nextLink: hasNextPage ? `/api/products?page=${nextPage}&limit=${limit}&sort=${sort}&query=${query}` : null,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: 'error', message: 'Error al obtener los productos' });
    }
};

// Función para agregar un producto
const addProduct = async (req, res) => {
    try {
        const { name, price, category } = req.body;
        const newProduct = new Product({ name, price, category });
        await newProduct.save();
        res.status(201).json({ status: 'success', payload: newProduct });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: 'error', message: 'Error al agregar el producto' });
    }
};

// Función para eliminar un producto
const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedProduct = await Product.findByIdAndDelete(id);
        if (!deletedProduct) {
            return res.status(404).json({ status: 'error', message: 'Producto no encontrado' });
        }
        res.json({ status: 'success', payload: deletedProduct });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: 'error', message: 'Error al eliminar el producto' });
    }
};

module.exports = {
    getProducts,
    addProduct,
    deleteProduct
};