const express = require("express");
const auth = require("../middleware/authMiddleware");
// Use exact paths/casing matching user's files
const cartController = require("../controller/cartController");
const router = express.Router();

// Apply authentication middleware to all cart routes
router.use(auth);

// GET user's cart
router.get("/", cartController.getCart);

// Add to cart
router.post("/", cartController.addToCart);

// Future: update quantity and delete endpoints can be added when controller exposes them

module.exports = router;
