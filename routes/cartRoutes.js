const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");
const { verify, verifyNonAdmin } = require("../auth");

// Retrieve Cart
router.get("/get-cart", verify, cartController.getUserCart);

// Add to cart
router.post("/add-to-cart", verify, cartController.addToCart);

// get active cart
router.get("/active", verify, cartController.getActiveCart);

// Update cart quantity
router.patch("/update-cart-quantity", verify, cartController.updateCartQuantity);

//  Remove item from cart
router.patch("/:productId/remove-from-cart", verify, cartController.removeFromCart);

// Clear Cart
router.put("/clear-cart", verify, cartController.clearCart);


module.exports = router;
