const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const { verify, verifyAdmin } = require("../auth");



// Create Order
router.post("/checkout", verify, orderController.checkoutOrder);

// Retrieve Login User Order 
router.get("/my-orders", verify, orderController.retrieveUserOrders);

// Retrieve all order
router.get("/all-orders", verify, verifyAdmin, orderController.retrieveAllOrders);












module.exports = router;   