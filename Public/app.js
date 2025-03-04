const mongoose = require("mongoose");

// Conexión con MongoDB (reemplaza con tu URL de MongoDB)
mongoose.connect("mongodb://localhost:27017/proyecto-final", {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log("Conexión a MongoDB exitosa");
}).catch((err) => {
  console.error("Error al conectar con MongoDB:", err);
});
