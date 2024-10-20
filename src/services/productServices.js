const productModel = require('../models/productModel');

const getAllProducts = async () => {
    console.log("Request income to fetch all the products....");
    try {
        const products = await productModel.findMany();
        console.log("Sending products to client....");
        return products;
    } catch (error) {
        console.error("Error fetching products:", error);
        throw error;
    }
};

const getProductById = async (id) => {
    console.log("Request income to find a product...");
    return await productModel.findUnique({
        where: { id }
    });
};

const createProduct = async (productDetails) => {
    console.log("Request incoming to create a product....");

    try {
        // Step 1: Get all existing SKUs from the database
        const products = await productModel.findMany({
            select: { SKU_id: true },  // Only fetch the SKU field
            orderBy: { SKU_id: 'desc' }  // Sort in descending order to get the highest SKU
        });

        // Step 2: Calculate the new SKU
        let newSKU;
        if (products.length > 0) {
            const highestSKU = parseInt(products[0].SKU_id);  // Get the highest SKU
            newSKU = highestSKU + 1;  // Increment by 1
        } else {
            newSKU = 1;  // Start with 1 if no products exist
        }

        // Step 3: Create the product with the new SKU
        const product = {
            SKU_id: newSKU.toString(),  // Store SKU as a string
            name: productDetails.name,
            description: productDetails.description,
            price: productDetails.price,
            expiary_date: new Date(productDetails.expiary_date).toISOString(),
            manufacture_date: new Date(productDetails.manufacture_date).toISOString(),
            net_weight: productDetails.net_weight,
        };

        const response = await productModel.create({ data: product });
        console.log("Product created successfully..", response);
        return response;

    } catch (error) {
        console.error("Error while creating product:", error);
        throw error;
    }
};

const updateProduct = async (id, productDetails) => {
    console.log("Income to update product.....");
    const updateData = { ...productDetails };

    if (productDetails.manufacture_date || productDetails.expiary_date) {
        updateData.manufacture_date = new Date(productDetails.manufacture_date);
        updateData.expiary_date = new Date(productDetails.expiary_date);
    }

    const isfound = await productModel.findUnique({ where: { id } });

    if (isfound) {
        console.log("Product found to update...");
        try {
            const response = await productModel.update({
                where: { id },
                data: updateData,
            });
            if (response) {
                return response;
            } else {
                return false;
            }
        } catch (error) {
            console.error("Error updating product:", error);
            throw error;
        }
    } else {
        console.log("Product not found for update");
        return false;
    }
};

const deleteProduct = async (id) => {
    console.log("Incoming delete request...", id);

    try {
        const response = await productModel.findUnique({ where: { id } });
        console.log("Found product...", response);

        if (!response) {
            console.log("Product not found");
            throw new Error("Product not found");
        } else {
            await productModel.delete({ where: { id } });
            console.log("Product deleted successfully");
            return "Product deleted successfully";
        }

    } catch (error) {
        console.log("Error:", error.message);
        return error.message;
    }
};

module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
};
