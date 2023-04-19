
require('dotenv').config({ path: 'backend/config/config.env' });

module.exports = {
  urls: {
    development: [
      process.env.DEV_HOST1,
      process.env.DEV_HOST2,
    ],
    production: [
      process.env.PROD_HOST,
    ]
  },
  db_url: {
    development: process.env.DB_URI_DEV,
    production: process.env.DB_URI_PROD,
  },
  google_url: {
    development: process.env.GOOGLE_CALLBACK_URL_DEV,
    production: process.env.GOOGLE_CALLBACK_URL_PROD
  },
  fb_url: {
    development: process.env.FB_CALLBACK_URL_DEV,
    production: process.env.FB_CALLBACK_URL_PROD
  }
};
