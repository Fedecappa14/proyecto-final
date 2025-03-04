const Product = require("./models/Product");

// Crear un producto
app.post("/api/products", async (req, res) => {
  try {
    const { name, price, category } = req.body;
    const newProduct = new Product({ name, price, category });
    await newProduct.save();
    res.status(201).json({ status: "success", product: newProduct });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
});

// Obtener productos con filtros, paginación, y orden
app.get("/api/products", async (req, res) => {
  try {
    const { limit = 10, page = 1, query = "", sort = "" } = req.query;
    const queryConditions = query ? { name: new RegExp(query, "i") } : {};
    const sortOrder = sort === "asc" ? 1 : sort === "desc" ? -1 : 0;

    const products = await Product.find(queryConditions)
      .limit(Number(limit))
      .skip((page - 1) * limit)
      .sort({ price: sortOrder });

    const totalProducts = await Product.countDocuments(queryConditions);
    const totalPages = Math.ceil(totalProducts / limit);

    res.json({
      status: "success",
      payload: products,
      totalPages,
      page,
      hasPrevPage: page > 1,
      hasNextPage: page < totalPages,
    });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
});
