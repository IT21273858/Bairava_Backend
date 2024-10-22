const bwipjs = require('bwip-js');
const { getStorage, ref, uploadBytes, getDownloadURL } = require('@firebase/storage'); // Firebase
const { initializeApp } = require('firebase/app'); // Firebase

const firebaseConfig = {
    apiKey: process.env.apiKey,
    authDomain: process.env.authDomain,
    projectId: process.env.projectId,
    storageBucket: process.env.storageBucket,
    messagingSenderId: process.env.messagingSenderId,
    appId: process.env.appId
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const storage = getStorage(firebaseApp);

// Function to generate a barcode image and upload to Firebase
const generateAndUploadBarcode = async (SKU_id) => {
    try {
        // Generate barcode image as a PNG buffer
        const barcodeBuffer = await bwipjs.toBuffer({
            bcid: 'code128',       // Barcode type
            text: SKU_id,          // Text to encode (SKU_id in this case)
            scale: 3,              // 3x scaling factor
            height: 10,            // Barcode height, in millimeters
            width:40,
            includetext: true,     // Show human-readable text
            textxalign: 'center',  // Align the text in the center
        });

        // Create a reference to Firebase Storage
        const storageRef = ref(storage, `barcodes/${SKU_id}.png`);

        // Upload the barcode image buffer to Firebase Storage
        await uploadBytes(storageRef, barcodeBuffer, { contentType: 'image/png' });

        // Get the downloadable URL from Firebase Storage
        const barcodeUrl = await getDownloadURL(storageRef);

        console.log('Barcode image uploaded successfully:', barcodeUrl);

        return barcodeUrl; // Return the Firebase URL to store in your database

    } catch (error) {
        console.error('Error generating or uploading barcode:', error);
        throw error;
    }
};

module.exports = { generateAndUploadBarcode };
