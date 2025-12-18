

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const productsRouter = require("./routes/products");
const cartRouter = require("./routes/cart");
const authRouter = require("./routes/auth");
const ordersRouter = require("./routes/orders");
const authMiddleware = require("./middleware/authMiddleware");
const createDB = require("./config/db");
createDB();
const app = express();
// const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/products", productsRouter);
app.use("/cart", cartRouter);
app.use("/auth", authRouter);
app.use("/orders", ordersRouter);

// Health check endpoint
app.get("/", (req, res) => {
  res.json({ message: "Havox E-commerce API Server is running" });
});

// Start server
app.listen(process.env.PORT, () => {
  console.log(`✓ Server running on http://localhost:${process.env.PORT}`);
  console.log(`✓ GET http://localhost:${process.env.PORT}/products - Get all products`);
  console.log(`✓ GET http://localhost:${process.env.PORT}/products/:id - Get product by ID`);
  console.log(`✓ POST http://localhost:${process.env.PORT}/products - Add new product`);
  console.log(`✓ PUT http://localhost:${process.env.PORT}/products/:id - Update product`);
  console.log(`✓ DELETE http://localhost:${process.env.PORT}/products/:id - Delete product`);
  console.log(`✓ GET http://localhost:${process.env.PORT}/cart - Get cart items`);
  console.log(`✓ POST http://localhost:${process.env.PORT}/cart - Add to cart`);
  console.log(`✓ PUT http://localhost:${process.env.PORT}/cart/:id - Update cart quantity`);
  console.log(`✓ DELETE http://localhost:${process.env.PORT}/cart/:id - Remove from cart`);
  console.log(`✓ GET http://localhost:${process.env.PORT}/orders - Get all orders`);
  console.log(`✓ POST http://localhost:${process.env.PORT}/orders - Create new order`);
  console.log(`✓ GET http://localhost:${process.env.PORT}/orders/:id - Get order by ID`);
  console.log(`✓ PUT http://localhost:${process.env.PORT}/orders/:id/status - Update order status`);
  console.log(`✓ DELETE http://localhost:${process.env.PORT}/orders/:id - Cancel order`);
});
