const app = require('./app'); // Asegúrate de que app.js esté exportando correctamente el objeto 'app'

const PORT = process.env.PORT || 3000; // Usa un puerto por defecto si no se establece en el entorno

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});