const Order = require("../models/Order");
const { errorHandler } = require("../auth");
const Cart = require("../models/Cart");

// Create Order
module.exports.checkoutOrder = (req, res) => {
  const userId = req.user.id;

  Cart.findOne({ userId })
    .then(cart => {
      if (!cart || cart.cartItems.length === 0) {
        return res.status(404).send({
          error: "No Items to Checkout"
        });
      }

      const order = new Order({
        userId,
        productsOrdered: cart.cartItems.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          subtotal: item.subtotal
        })),
        totalPrice: cart.totalPrice
      });

      return order.save();
    })
    .then(savedOrder => {
      res.status(200).send({
        message: "Ordered Successfully"
      });
    })
    .catch(err => errorHandler(err, req, res));
};

// Retrieved login user order

module.exports.retrieveUserOrders = async (req, res) => {
	try {
		
		const userId = req.user.id;

		
		if (!userId) {
			return res.status(401).send({ 
				message: "User is Invalid" 
			});
		}

		// Find all orders for this user
		const orders = await Order.find({ userId }).populate('productsOrdered.productId');

		// If no orders found, send appropriate message
		if (!orders || orders.length === 0) {
			return res.status(200).send({ 
				message: "No orders found for this user",
				orders: [] 
			});
		}

		// Send the found orders
		return res.status(200).send({ 
			orders 
		});

	} catch (err) {
		// Handle any errors
		return errorHandler(err, req, res);
	}
};


// Retrieve all orders
module.exports.retrieveAllOrders = (req, res) => {
	const userId = req.user.id;
    Order.find()
        .then(orders => {
            // Always return an array (even if empty)
            return res.status(200).send({
            	orders: orders});
        })
        .catch(err => errorHandler(err, req, res));
};