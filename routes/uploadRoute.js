const express = require('express');
const router = express.Router();
const upload = require('../upload');
const { bucket } = require('../googleCloudConfig');

// Upload single image
router.post('/upload', upload.single('image'), async (req, res) => {
    console.log("Income to uplload single file");
    
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded.' });
        }
        console.log("Request from body...");
        console.log(req.body);

        console.log("Requested file");
        console.log(req.file);
        
        
        
        

        const folderName = req.body.type || 'Images';
        const fileName = `${req.file.originalname}-${Date.now()}`;
        const filePath = `${folderName}/${fileName}`;

        const blob = bucket.file(filePath);
        const blobStream = blob.createWriteStream({
            metadata: {
                contentType: req.file.mimetype,
            },
        });

        blobStream.on('error', (err) => {
            return res.status(500).json({ error: err.message });
        });

        blobStream.on('finish', async () => {
            const publicUrl = `https://storage.googleapis.com/${bucket.name}/${filePath}`;
            res.status(200).json({ fileUrl: publicUrl });
        });

        blobStream.end(req.file.buffer);
    } catch (error) {
        console.log("Error in upload",error);
        
        res.status(500).json({ error: error.message });
    }
});

// Upload multiple images
router.post('/upload/multiple', upload.array('images', 10), async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ error: 'No files uploaded.' });
        }

        const folderName = req.body.type || 'Images';
        const filePromises = req.files.map(file => uploadFile(file, folderName));

        const fileUrls = await Promise.all(filePromises);

        res.status(200).json({ fileUrls });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Helper function to upload a file
const uploadFile = (file, folderName) => {
    return new Promise((resolve, reject) => {
        const fileName = `${file.originalname}-${Date.now()}`;
        const filePath = `${folderName}/${fileName}`;

        const blob = bucket.file(filePath);
        const blobStream = blob.createWriteStream({
            metadata: {
                contentType: file.mimetype,
            },
        });

        blobStream.on('error', (err) => {
            reject(err);
        });

        blobStream.on('finish', () => {
            const publicUrl = `https://storage.googleapis.com/${bucket.name}/${filePath}`;
            resolve(publicUrl);
        });

        blobStream.end(file.buffer);
    });
};

module.exports = router;
