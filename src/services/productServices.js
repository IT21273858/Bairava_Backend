const productModel = require('../models/productModel');
const { generateAndUploadBarcode } = require('./generateBarcode');

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
        // Fetch the latest product to find the last SKU_id
        const latestProduct = await productModel.findFirst({
            orderBy: {
                SKU_id: 'desc', // Fetch the latest SKU by ordering it in descending order
            },
        });

        // Increment the SKU_id based on the last one
        let newSKU;
        if (latestProduct) {
            // Assuming SKU_id is numeric, otherwise modify the logic for alphanumeric SKUs
            newSKU = (parseInt(latestProduct.SKU_id) + 1).toString();
        } else {
            // Start SKU from a default value if there are no products
            newSKU = '1001';
        }

        // Generate and upload barcode image
        const barcodeUrl = await generateAndUploadBarcode(newSKU);

        const product = {
            SKU_id: newSKU, // Assign the newly generated SKU
            name: productDetails.name,
            description: productDetails.description,
            price: productDetails.price,
            expiary_date: new Date(productDetails.expiary_date).toISOString(),
            manufacture_date: new Date(productDetails.manufacture_date).toISOString(),
            net_weight: productDetails.net_weight,
            barcode_image: barcodeUrl, // Store the barcode image URL
        };

        const response = await productModel.create({ data: product });
        console.log("Product created successfully:", response);
        return response;

    } catch (error) {
        console.log("Error creating product:", error);
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
