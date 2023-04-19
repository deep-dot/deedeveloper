// const mongoose = require('mongoose');
// const connectDatabase = async() => {
//         const conn = await mongoose.connect(process.env.DB_URI, {
//           useNewUrlParser: true,
//           useUnifiedTopology: true,   
//         })
    
//         console.log(`MongoDB Connected: ${conn.connection.host}`)
// }
// module.exports = connectDatabase;


const mongoose = require('mongoose');
const config = require('./config.js');

const connectDatabase = async () => {
  const env = process.env.NODE_ENV || 'development';
  console.log('database connecte', config.db_url[env])
  const conn = await mongoose.connect(config.db_url[env], {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  console.log(`MongoDB Connected: ${conn.connection.host}`);
};

module.exports = connectDatabase;
