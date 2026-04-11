const Cart = require("../models/Cart");
const { errorHandler } = require("../auth");

// Get logged-in user's cart
module.exports.getUserCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const cart = await Cart.findOne({ userId }).populate("cartItems.productId");

    const cartItems = cart ? cart.cartItems : [];
    const totalPrice = cart ? cart.totalPrice : 0;

    res.status(200).send({
      cart: cart
    });
  } catch (err) {
    errorHandler(err, req, res);
  }
};

// Add item to cart
module.exports.addToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, price, quantity } = req.body;

    if (!productId || !price || !quantity)
      return res.status(400).send({ success: false, message: "productId, price, quantity required" });

    let cart = await Cart.findOne({ userId });
    if (!cart) cart = new Cart({ userId, cartItems: [], totalPrice: 0 });

    const subtotal = price * quantity;
    const item = cart.cartItems.find(i => i.productId.toString() === productId);

    if (item) {
      item.quantity += quantity;
      item.subtotal += subtotal;
    } else {
      cart.cartItems.push({ productId, quantity, subtotal });
    }

    cart.totalPrice = cart.cartItems.reduce((sum, i) => sum + i.subtotal, 0);
    await cart.save();

    res.status(200).send({ 
      message: "Item added to cart successfully", 
      cart 
    });
  } catch (err) {
    errorHandler(err, req, res);
  }
};

// Get active cart items (same as get-cart)
module.exports.getActiveCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const cart = await Cart.findOne({ userId });

    res.status(200).send({
      success: true,
      cart: cart ? cart.cartItems : []
    });
  } catch (err) {
    errorHandler(err, req, res);
  }
};

// Update cart quantity
module.exports.updateCartQuantity = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, newQuantity } = req.body;

    if (!productId || newQuantity === undefined)
      return res.status(400).send({ success: false, message: "productId and newQuantity are required" });

    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).send({ success: false, message: "Cart not found" });

    const item = cart.cartItems.find(i => i.productId.toString() === productId);
    if (!item) return res.status(404).send({ success: false, message: "Item not found in cart" });

    const pricePerUnit = item.subtotal / item.quantity;
    item.quantity = newQuantity;
    item.subtotal = pricePerUnit * newQuantity;

    cart.totalPrice = cart.cartItems.reduce((sum, i) => sum + i.subtotal, 0);
    await cart.save();

    res.status(200).send({ 
      message: "Item quantity updated successfully", 
      updatedCart: cart
    });
  } catch (err) {
    errorHandler(err, req, res);
  }
};

// Remove specific item from cart
module.exports.removeFromCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;

    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).send({ message: "Item not found in cart" });

    const itemIndex = cart.cartItems.findIndex(
      item => item.productId.toString() === productId
    );

    if (itemIndex === -1)
      return res.status(404).send({ message: "Item not found in cart" });

    cart.cartItems.splice(itemIndex, 1);

    cart.totalPrice = cart.cartItems.reduce((sum, item) => sum + item.subtotal, 0);

    await cart.save();

    res.status(200).send({
      success: true,
      message: "Item removed from cart successfully",
      cart
    });
  } catch (err) {
    errorHandler(err, req, res);
  }
};


// Clear entire cart
module.exports.clearCart = async (req, res) => {
  try {
    const userId = req.user.id;

    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).send({ message: "Cart not found" });

    cart.cartItems = [];
    cart.totalPrice = 0;

    await cart.save();

    res.status(200).send({
      message: "Cart cleared successfully",
      cart
    });
  } catch (err) {
    errorHandler(err, req, res);
  }
};
