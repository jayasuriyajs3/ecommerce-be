const express = require("express");
const auth = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");
const orderController = require("../controller/orderController");
const router = express.Router();

// Apply authentication middleware to all order routes
router.use(auth);

// GET all orders for user
router.get("/", orderController.getOrders);

// GET single order by ID
router.get("/:id", orderController.getOrderById);

// POST create new order
router.post("/", orderController.createOrder);

// PUT update order status (admin-only)
router.put("/:id/status", admin, orderController.updateOrderStatus);

// DELETE/cancel order
router.delete("/:id", orderController.cancelOrder);

module.exports = router;
