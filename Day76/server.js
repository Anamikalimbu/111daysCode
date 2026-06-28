const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const dotenv = require("dotenv");

dotenv.config();

const connectDB = require("./config/db");
const productRoutes = require("./routes/productRoutes");
const errorMiddleware = require("./middleware/errorMiddleware");
const AppError = require("./utils/AppError");

// Connect to MongoDB
connectDB();

const app = express();

// ── Security Middleware ───────────────────────────────────────

// Set secure HTTP headers
app.use(helmet());

// Rate limiting: max 100 requests per 15 minutes per IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests from this IP, please try again after 15 minutes.",
  },
});
app.use("/api", limiter);

// CORS — allow frontend origin
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ── General Middleware ────────────────────────────────────────

app.use(express.json({ limit: "10kb" })); // Parse JSON, limit body size
app.use(express.urlencoded({ extended: true }));

// Request logging (only in development)
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// ── Routes ────────────────────────────────────────────────────

// Health check
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "🚀 Day 75 REST API is running",
    version: "v1",
    endpoints: {
      products: "/api/v1/products",
      stats: "/api/v1/products/stats",
    },
  });
});

// API v1 routes
app.use("/api/v1/products", productRoutes);

// ── 404 Handler ───────────────────────────────────────────────
// Catch all unmatched routes
app.all("*", (req, res, next) => {
  next(new AppError(`Route ${req.originalUrl} not found`, 404));
});

// ── Global Error Handler ──────────────────────────────────────
app.use(errorMiddleware);

// ── Start Server ──────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  console.log(`📡 API: http://localhost:${PORT}/api/v1/products\n`);
});

// Handle unhandled promise rejections (outside Express)
process.on("unhandledRejection", (err) => {
  console.error("💥 Unhandled Rejection:", err.message);
  process.exit(1);
});
