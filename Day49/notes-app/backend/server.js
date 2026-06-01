const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

// Load environment variables from .env file
dotenv.config();

const app = express();

// ─────────────────────────────────────────
// Middleware
// ─────────────────────────────────────────
app.use(cors({
  origin: "http://localhost:3000", // React frontend URL
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type"],
}));

app.use(express.json());        // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// ─────────────────────────────────────────
// MongoDB Connection
// ─────────────────────────────────────────
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB connection failed: ${error.message}`);
    process.exit(1); // Exit process on DB failure
  }
};

connectDB();

// ─────────────────────────────────────────
// Routes
// ─────────────────────────────────────────
const notesRouter = require("./routes/notes");
app.use("/api/notes", notesRouter);

// Health check route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "📝 NoteStack API is running",
    version: "1.0.0",
    endpoints: {
      notes: "/api/notes",
    },
  });
});

// ─────────────────────────────────────────
// 404 — Route Not Found Handler
// ─────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`,
  });
});

// ─────────────────────────────────────────
// Global Error Handler
// ─────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error("Unhandled Error:", err.stack);
  res.status(500).json({
    success: false,
    message: "Something went wrong on the server",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

// ─────────────────────────────────────────
// Start Server
// ─────────────────────────────────────────
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  console.log(`📋 API available at http://localhost:${PORT}/api/notes`);
});