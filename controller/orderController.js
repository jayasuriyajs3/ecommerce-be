const Order = require("../models/order");
const Product = require("../models/product");
const Cart = require("../models/cart");

// Get orders
// - Admin: all orders
// - User: only their own orders
const getOrders = async (req, res) => {
  try {
    const isAdmin = req?.userData?.role === "admin";
    const query = isAdmin ? {} : { user: req.userData.id };
    
    console.log("Fetching orders with query:", query);
    console.log("User ID from token:", req.userData.id);
    console.log("User role:", req.userData.role);
    
    const orders = await Order.find(query)
      .populate("products.product")
      .populate("user", "email role")
      .sort({ createdAt: -1 }); // Latest orders first

    console.log("Found orders:", orders.length);
    res.status(200).json({ orders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
};

// Get a single order by ID
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.userData.id, // Ensure user can only access their own orders
    }).populate("products.product");

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.status(200).json({ order });
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({ error: "Failed to fetch order" });
  }
};

// Create a new order
const createOrder = async (req, res) => {
  try {
    const { products, billingAddress, shippingAddress, pricing, paymentMethod } = req.body;

    console.log("Creating order for user:", req.userData.id);
    console.log("Order data received:", { products, billingAddress, shippingAddress, pricing, paymentMethod });

    // Validate required fields
    if (!products || products.length === 0) {
      return res.status(400).json({ error: "No products in order" });
    }

    if (!billingAddress || !shippingAddress || !pricing) {
      return res.status(400).json({ error: "Missing required order information" });
    }

    // Validate products exist and get current prices
    const validatedProducts = [];
    for (const item of products) {
      let product = null;
      // Support both Mongo _id (ObjectId) and numeric `id` field from seed data
      try {
        product = await Product.findById(item.product);
      } catch (e) {
        product = null;
      }
      if (!product) {
        product = await Product.findOne({ id: item.product });
      }
      if (!product) {
        return res.status(404).json({ error: `Product ${item.product} not found` });
      }
      validatedProducts.push({
        product: product._id, // store canonical ObjectId reference
        quantity: item.quantity,
        price: product.price, // Use current price from database
      });
    }

    // Create the order
    const newOrder = await Order.create({
      user: req.userData.id,
      products: validatedProducts,
      billingAddress,
      shippingAddress,
      pricing,
      paymentMethod: paymentMethod || "cod",
      paymentStatus: paymentMethod === "cod" ? "pending" : "completed",
    });

    console.log("Order created:", newOrder);

    // Clear the user's cart after successful order
    await Cart.findOneAndUpdate(
      { user: req.userData.id },
      { products: [] }
    );

    const populatedOrder = await Order.findById(newOrder._id).populate("products.product");

    console.log("Populated order:", populatedOrder);

    res.status(201).json({
      message: "Order created successfully",
      order: populatedOrder,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ error: "Failed to create order" });
  }
};

// Update order status (for admin or tracking)
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    const validStatuses = ["pending", "processing", "shipped", "delivered", "cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    // Admin route: allow updating any order by ID
    const order = await Order.findOneAndUpdate(
      { _id: req.params.id },
      { status },
      { new: true }
    ).populate("products.product");

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.status(200).json({
      message: "Order status updated",
      order,
    });
  } catch (error) {
    console.error("Error updating order:", error);
    res.status(500).json({ error: "Failed to update order" });
  }
};

// Cancel an order (only if status is pending or processing)
const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.userData.id,
    });

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    if (["shipped", "delivered", "cancelled"].includes(order.status)) {
      return res.status(400).json({
        error: `Cannot cancel order with status: ${order.status}`,
      });
    }

    order.status = "cancelled";
    await order.save();

    res.status(200).json({
      message: "Order cancelled successfully",
      order,
    });
  } catch (error) {
    console.error("Error cancelling order:", error);
    res.status(500).json({ error: "Failed to cancel order" });
  }
};

module.exports = {
  getOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
  cancelOrder,
};
