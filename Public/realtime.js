const socket = io();  

// agregar un producto desde el servidor
socket.on('productAdded', (newProduct) => {
    const productList = document.getElementById('productList');
    const li = document.createElement('li');
    li.textContent = `${newProduct.name} - $${newProduct.price}`;
    productList.appendChild(li);
});

//envío de productos desde el formulario
const form = document.getElementById('addProductForm');
form.addEventListener('submit', (event) => {
    event.preventDefault();  // Previene el comportamiento por defecto del formulario

    const productName = document.getElementById('productName').value;
    if (!productName) return; // Evitar enviar formulario vacío

    //petición para agregar un nuevo producto
    fetch('/api/products', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            name: productName, 
            price: 100,  // Un precio por defecto
            category: 'Categoria 1'  // Asigna una categoría por defecto
        })
    })
    .then((response) => response.json())
    .then((data) => {
        if (data.status === 'success') {
            // El producto fue agregado correctamente, ya será manejado por socket.io
            console.log('Producto agregado:', data.payload);
        }
    })
    .catch((error) => {
        console.error('Error al agregar producto:', error);
    });

    // Limpiar el campo del formulario
    document.getElementById('productName').value = '';
});
