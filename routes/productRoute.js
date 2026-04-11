const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const { verify, verifyAdmin } = require("../auth");


// Create product
router.post("/", verify, verifyAdmin, productController.createProduct);

// Retrieve all products
router.get("/all", verify, verifyAdmin, productController.retrieveAllProducts);

// retrieve all product
router.get("/active", productController.retrieveAllActive);

// retrieve specific product
router.get("/:productId", productController.retrieveProduct);

// update product
router.patch("/:productId/update", verify, verifyAdmin, productController.updateProduct);

// archive product
router.patch("/:productId/archive", verify, verifyAdmin, productController.archiveProduct);

// activate product
router.patch("/:productId/activate", verify, verifyAdmin, productController.activateProduct);

// search by name
router.post("/search-by-name", productController.searchNameProd);

// search by price
router.post("/search-by-price", productController.searchByPrice);






module.exports = router;   