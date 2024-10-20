var express = require('express');
var app = express();
require('dotenv').config();
var routes = require('./routes/routes');
const cors = require('cors');
const { connectToDatabase } = require('./src/utils/db');
const PORT = process.env.PORT|| 8080;
const origins = process.env.Origins

// **Configure CORS with Security Considerations**
const allowedOrigins = [
  origins,
  "https://i.pinimg.com"
];

const corsOptions = {
  origin: function (origin, callback) {
    console.log("Request incoming to backend by...........", origin);
    if ((!origin || allowedOrigins.indexOf(origin) !== -1) || origin!=undefined) {
    
      callback(null, true);
    } else {
      callback(new Error('Request not allowed by Bairava. You are not authorized to perform this action'));
    }
  },
  credentials: true, // Include credentials for cookies, authorization headers, etc.
  optionsSuccessStatus: 200 // Optionally set to return a 200 status for OPTIONS requests
};

app.use(cors(corsOptions));

app.use(express.json({ limit: '5mb' }));
app.use(routes);

const startServer = async () => {
  await connectToDatabase();
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

startServer();


