require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');

const app = express();
const PORT = process.env.PORT || 3000;

const startServer = async () => {
  await connectDB();

  // Middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  // Routes
  app.use('/api/products', require('./routes/productRoutes'));

  // Home route
  app.get('/', (req, res) => {
    res.json({ message: '🚀 Express + Mongoose API is running!' });
  });

  // 404 handler
  app.use((req, res) => {
    res.status(404).json({ success: false, error: 'Route not found' });
  });

  // Global error handler
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ success: false, error: 'Server Error' });
  });

  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
};

startServer().catch((error) => {
  console.error('Failed to start server:', error.message);
  process.exit(1);
});
