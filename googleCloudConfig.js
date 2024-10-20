// const admin = require('firebase-admin');
// const serviceAccount = require('./vijibits-f402f-firebase-adminsdk-9zl3m-f8ceec1e5c.json');

// admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount),
//     storageBucket: 'gs://vijibits-f402f.appspot.com' // Replace with your Firebase Storage bucket
// });

// const bucket = admin.storage().bucket();

// module.exports = { bucket };

// Uncomment

// const { Storage } = require('@google-cloud/storage');
// const path = require('path');
// const pat = require('./testingcloudbuild-426219-15252bd1e52f.json')

// // Load the Google Cloud Storage credentials
// const serviceKey = path.join(__dirname, './testingcloudbuild-426219-15252bd1e52f.json');

// const storage = new Storage({
//     keyFilename: serviceKey,
//     projectId: 'testingcloudbuild-426219',
// });

// const bucketName = 'destinations.vibeslanka.com'; // Replace with your Google Cloud Storage bucket name
// const bucket = storage.bucket(bucketName);

// module.exports = { bucket };
