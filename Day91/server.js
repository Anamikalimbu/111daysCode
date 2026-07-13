const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const taskRoutes = require("./routes/taskRoutes");

dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // parse JSON request bodies

// Root route - simple API info
app.get("/", (req, res) => {
  res.json({
    message: "Day 92 - Simple REST API is running",
    endpoints: {
      "GET /api/tasks": "Get all tasks (optional ?status=pending|in-progress|completed)",
      "GET /api/tasks/:id": "Get a single task",
      "POST /api/tasks": "Create a new task",
      "PUT /api/tasks/:id": "Update a task",
      "DELETE /api/tasks/:id": "Delete a task",
    },
  });
});

// API routes
app.use("/api/tasks", taskRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
