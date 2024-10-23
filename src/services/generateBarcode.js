const bwipjs = require('bwip-js');

// Function to generate a barcode image and upload to Firebase
const generateBarcodeBase64 = async (SKU_id) => {
    try {
        // Generate barcode image as a PNG buffer
        const barcodeBuffer = await bwipjs.toBuffer({
            bcid: 'code128',       // Barcode type
            text: SKU_id,          // Text to encode (SKU_id in this case)
            scale: 3,              // 3x scaling factor
            height: 10,            // Barcode height, in millimeters
            width: 40,
            includetext: true,     // Show human-readable text
            textxalign: 'center',  // Align the text in the center
        });

        // Convert buffer to base64
        const barcodeBase64 = barcodeBuffer.toString('base64');

        // Return base64 image string
        console.log('Barcode image generated successfully in base64 format');
        return `data:image/png;base64,${barcodeBase64}`;

    } catch (error) {
        console.error('Error generating barcode:', error);
        throw error;
    }
};

module.exports = { generateBarcodeBase64 };
