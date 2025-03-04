// app.js
const express = require("express");
const mongoose = require("mongoose");
const exphbs = require("express-handlebars");
const path = require("path");
const { createServer } = require("http");
const { Server } = require("socket.io");

const app = express();
const server = createServer(app);
const io = new Server(server);

// Configuración de la base de datos
mongoose.connect("mongodb://localhost:27017/tuBaseDeDatos", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("Conectado a la base de datos"))
  .catch((err) => console.error("Error de conexión:", err));

// Configuración de Handlebars
app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

// Middleware para servir archivos estáticos desde "public"
app.use(express.static(path.join(__dirname, "public")));

let products = [];

app.get("/", (req, res) => {
  res.render("home", { products });
});

app.get("/realtimeproducts", (req, res) => {
  res.render("realTimeProducts");
});

io.on("connection", (socket) => {
  console.log("Cliente conectado");

  // Enviar lista actualizada al cliente
  socket.emit("updateProducts", products);

  // un cliente agrega un producto
  socket.on("addProduct", (data) => {
    if (!data.name) return;

    const newProduct = { id: products.length + 1, name: data.name };
    products.push(newProduct);
    console.log("Producto agregado:", newProduct);

    io.emit("updateProducts", products);
  });

  socket.on("disconnect", () => {
    console.log("Cliente desconectado");
  });
});

// Iniciar el servidor
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});