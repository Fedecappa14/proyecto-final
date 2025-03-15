const addProduct = async (req, res) => {
    try {
        const { name, price, category } = req.body;
        const newProduct = new Product({ name, price, category });
        await newProduct.save();

        // Emitir evento de producto agregado para los clientes conectados
        io.emit('productAdded', newProduct);  

        res.status(201).json({ status: 'success', payload: newProduct });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: 'error', message: 'Error al agregar el producto' });
    }
};