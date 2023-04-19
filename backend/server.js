
const app = require('./app');
const cors = require('cors');
const connectDatabase = require('./config/database');
const cloudinary = require('cloudinary').v2;
const config = require('./config/config');

// Config
  require('dotenv').config({ path: 'backend/config/config.env' });

// Enable CORS middleware
app.use(cors());

connectDatabase();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
  secure: true,
});

// Handling Uncaught Exception
process.on('uncaughtException', (err) => {
  console.log(`Error: ${err.message}`);
  console.log('Shutting down the server due to Uncaught Exception');
  process.exit(1);
});

const env = process.env.NODE_ENV || 'development';
const server = app.listen(process.env.PORT || 5000, () => {
  const url = config.urls[process.env.NODE_ENV || 'development'];
  if (url) {
    if (process.env.NODE_ENV === 'development') {
      if (Array.isArray(url)) {
        url.forEach((urlItem) => console.log(`listening on ${urlItem}:${process.env.PORT}`));
      } else {
        console.log(`listening on ${url}`);
      }
    } else {
      console.log(`listening on ${url}`);
    }
  } else {
    console.error('Failed to retrieve URL from config file');
  }
  console.log(config.google_url[env], config.fb_url[env])
});


// Unhandled Promise Rejection
process.on('unhandledRejection', (err) => {
  console.log(`Error: ${err}`);
  console.log('Shutting down the server due to Unhandled Promise Rejection');
  server.close(() => {
    process.exit(1);
  });
});
