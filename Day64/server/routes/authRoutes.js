const express = require("express");
const router = express.Router();
const rateLimit = require("express-rate-limit");

const {
  register,
  login,
  forgotPassword,
  resetPassword,
  getProfile,
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

// Rate limiter for auth-sensitive routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: {
    success: false,
    message: "Too many requests from this IP. Please wait 15 minutes.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const forgotLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5,
  message: {
    success: false,
    message: "Too many password reset attempts. Try again in 1 hour.",
  },
});

router.post("/register", authLimiter, register);
router.post("/login", authLimiter, login);
router.post("/forgot-password", forgotLimiter, forgotPassword);
router.put("/reset-password/:token", authLimiter, resetPassword);
router.get("/profile", protect, getProfile);

module.exports = router;