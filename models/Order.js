const mongoose = require("mongoose");

const orderedProductSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  subtotal: {
    type: Number,
    required: true,
    min: 0
  }
});

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  productsOrdered: [orderedProductSchema],

  totalPrice: {
    type: Number,
    required: true,
    min: 0
  },

  orderedOn: {
    type: Date,
    default: Date.now
  },

  status: {
    type: String,
    default: "Pending",
    enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"]
  }
});

module.exports = mongoose.model("Order", orderSchema);
