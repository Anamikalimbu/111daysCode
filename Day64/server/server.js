const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const authRoutes = require("./routes/authRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

const app = express();

// Middleware
app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173" }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Health check
app.get("/", (req, res) => {
  res.json({
    message: "🔐 Day 63 – Password Reset System API",
    status: "running",
    endpoints: {
      register: "POST /api/auth/register",
      login: "POST /api/auth/login",
      forgotPassword: "POST /api/auth/forgot-password",
      resetPassword: "PUT /api/auth/reset-password/:token",
      profile: "GET /api/auth/profile",
    },
  });
});

// Routes
app.use("/api/auth", authRoutes);

// Error Handling
app.use(notFound);
app.use(errorHandler);

// DB + Server
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/day63-auth")
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  });