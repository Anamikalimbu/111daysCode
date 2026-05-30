const mongoose = require('mongoose');

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/Day47';

  if (!process.env.MONGO_URI) {
    console.warn(' MONGO_URI not found in environment; using default local MongoDB URL');
  }

  try {
    const conn = await mongoose.connect(mongoUri);
    console.log(` MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(' MongoDB Connection Error:', error.message);
    console.error('Please ensure MongoDB is running and the connection URI is correct.');
    process.exit(1);
  }
};

module.exports = connectDB;
