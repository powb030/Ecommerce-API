const Product = require("../models/Product");
const { errorHandler } = require("../auth");
const auth = require("../auth");

// Create Products
module.exports.createProduct = (req, res) => {
    const { name, description, price } = req.body;

      if (!name || !description || !price) {
            return res.status(400).send({ message: "All fields are required" });
        }

        const newProduct = new Product({ name, description, price });

        newProduct.save()
            .then(product => res.status(201).send({ product }))
            .catch(err => errorHandler(err, req, res));
    };  



// Retrieve All Products
module.exports.retrieveAllProducts = (req, res) => {
    Product.find()
        .then(products => {
            // Always return an array (even if empty)
            return res.status(200).send(products);
        })
        .catch(err => errorHandler(err, req, res));
};





// Retrieve all active product
module.exports.retrieveAllActive = (req, res) => {
    return Product.find({isActive: true})
    .then(products => {

        if(products.length === 0){
            return res.status(404).send({message: "Product not found"}) 
        }
        else {
            return res.status(200).send(
                products
            );
        } 
        
   })
   .catch(err => errorHandler(err, req, res));
}; 


// Retrieve single product
module.exports.retrieveProduct = (req, res) => {
    const { productId } = req.params;

    Product.findById(productId)
        .then(product => {
            if (!product) {
                return res.status(404).send({
                    message: "Product not found"
                });
            }

            return res.status(200).send({
                product
            });
        })
        .catch(err => errorHandler(err, req, res));
};

// Update Product

module.exports.updateProduct = async (req, res) => {
    try {
        const { productId } = req.params;

        const updatedProductData = {
            name: req.body.name,
            description: req.body.description,
            price: req.body.price
        };

        const product = await Product.findByIdAndUpdate(
            productId,
            updatedProductData,
            { new: true }
        );

        if (!product) {
            return res.status(404).send({ error: "Product not found" });
        }

        return res.status(200).send({
            success: true,
            message: "Product updated successfully"
        });

    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(404).send({ error: "Product not found" });
        }
        return errorHandler(error, req, res);
    }
};





// Archive Product 
module.exports.archiveProduct = (req, res) => {
    const { productId } = req.params;

    Product.findById(productId)
        .then(product => {

            if (!product) {
                return res.status(404).send({
                    error: 'Product not found'
                });
            }

            if (product.isActive === false) {
                return res.status(200).send({
                    message: 'Product already archived',
                    archiveProduct: product
                });
            }

            product.isActive = false;

            return product.save().then(() => {
                return res.status(200).send({
                    success: true,
                    message: 'Product archived successfully'
                });
            });
        })
        .catch(err => {
            if (err.name === 'CastError') {
                return res.status(404).send({
                    error: 'Product not found'
                });
            }

            return errorHandler(err, req, res);
        });
};




// Activate Product
module.exports.activateProduct = (req, res) => {
    const { productId } = req.params;

    Product.findById(productId)
        .then(product => {
            if (!product) {
                return res.status(404).send({ message: "Product not found!" });
            }

            if (product.isActive === true) {
                return res.status(200).send({
                    message: "Product already active",
                    activateProduct: product
                });
            }

            product.isActive = true;

            return product.save().then(() => {
                return res.status(200).send({
                    success: true,
                    message: "Product activated successfully"
                });
            });
        })
        .catch(err => {
            if (err.name === 'CastError') {
                return res.status(404).send({ error: "Product not found!" });
            }
            return errorHandler(err, req, res);
        });
};


// Search product by name
module.exports.searchNameProd = (req, res) => {
    const name = req.body.name;

    if (!name) {
        return res.status(400).send({
            message: "Product name is required"
        });
    }

    Product.findOne({ name })
        .then(product => {
            if (!product) {
                return res.status(404).send({
                    message: "Product not found"
                });
            }

            // name matched → send product details
            return res.status(200).send(product);
        })
        .catch(err => errorHandler(err, req, res));
};


module.exports.searchByPrice = (req, res) => {
    const { minPrice, maxPrice } = req.body;

    if (minPrice == null || maxPrice == null) {
        return res.status(400).send({
            message: "Both minPrice and maxPrice are required"
        });
    }
    if (minPrice > maxPrice) {
        return res.status(400).send({
            message: "minPrice cannot be greater than maxPrice"
        });
    }

    // Find products within the price range
    Product.find({ price: { $gte: minPrice, $lte: maxPrice } })
        .then(products => {
            if (products.length === 0) {
                return res.status(404).send({
                    message: "No products found in this price range"
                });
            }

            return res.status(200).send({ products });
        })
        .catch(err => {
            console.error(err);
            return res.status(500).send({ message: "Server error" });
        });
};



