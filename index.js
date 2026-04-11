const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");


// Routes
const userRoutes = require("./routes/userRoute");
const productRoutes = require("./routes/productRoute");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");


require("dotenv").config();

const app = express(); // creating an express server application

app.use(express.json()); // parse json data

// CORS
const corsOptions = {
	origin: [process.env.CLIENT_URL || "http://localhost:4000"],
	credentials: true,
	optionsSuccessStatus: 200
}

app.use(cors(corsOptions));

// Connection to MONGODB
mongoose.connect(process.env.MONGODB_STRING);
mongoose.connection.once("open", () => console.log("Now connected to MongoDB Atlas."))

app.use("/users", userRoutes);
app.use("/products", productRoutes);
app.use("/cart", cartRoutes);
app.use("/orders", orderRoutes);

app.listen(process.env.PORT || 3000, () => 
	console.log(`API is now online at port ${process.env.PORT || 3000}`)
);

module.exports = {app, mongoose};
