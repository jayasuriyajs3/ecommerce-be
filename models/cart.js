const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
  {
    user:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: { type: Number, required: true, default: 1 },
      },
    ],
  },
  { timestamps: true }
);

// Avoid OverwriteModelError in dev with nodemon
module.exports = mongoose.models.Cart || mongoose.model("Cart", cartSchema);