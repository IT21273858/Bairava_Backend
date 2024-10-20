const productService = require('../services/productServices')

const getAllProducts = async (req, res) => {
    try {
        const products = await productService.getAllProducts();
        if (products) {
            res.status(200).json({ status: true, products, message: "Data retreived sucess" });
        }
        else {
            res.status(404).json({ status: false, message: "Not Data Available" })
        }
    } catch (error) {
        res.status(500).json({ error: 'Error retrieving products' });
    }
};

const getProductById = async (req, res) => {
    const { id } = req.params;
    try {
        const product = await productService.getProductById(id);
        if (product) {
            res.status(200).json({ status: true, product, message: "Product found" });
        } else {
            res.status(404).json({ status: false, error: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ status: false, error: 'Error retrieving Product' });
    }
};

const createProduct = (req, res) => {
    try {
        const product = productService.createProduct(req.body);
        product.then(() => { res.status(201).json({ status: true, message: "Product Created Sucessfully" }); })
            .catch((error) => {
                if (error instanceof Prisma.PrismaClientKnownRequestError) {
                    // Handle Prisma known request errors
                    if (error.code === 'P2002') {
                        res.status(500).json({ status: false, message: "New user cannot be created with this email", code: "P2002" });
                    }
                } else {
                    res.status(500).json({ status: false, message: "An unexpected error occurred" });
                }

                res.status(404).json({ status: false, message: "Product Creation UnSucessfull" });
            })
    } catch (error) {
        res.status(500).json({ error: `Product could not be created - ${error} ` });
    }
};


const updateProduct = async (req, res) => {
    const { id } = req.params;
    try {
        const product = await productService.updateProduct(id, req.body);
        if (product) {
            res.status(200).json({ status: true, message: "Product Updated Sucessfully" });
        }
        else {
            res.status(404).json({ status: false, message: "No user found to update" })
        }
    } catch (error) {
        res.status(500).json({ error: 'Product could not be updated' });
    }
};

const deleteProduct = async (req, res) => {
    const { id } = req.params;
    try {
        const response = await productService.deleteProduct(id);
        console.log("Response is....", response);
        if (response == 'Not an author') {
            res.status(404).json({ status: false, message: response })
        }
        else {
            res.status(200).json({ status: true, message: 'Product deleted' });
        }
    } catch (error) {
        res.status(500).json({ status: false, error: 'Product could not be deleted' });
    }
};

module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
};
