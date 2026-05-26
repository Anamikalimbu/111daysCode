const express = require("express");
const { body } = require("express-validator");
const { register, login, getMe, updateMe } = require("../controllers/authController");
const { protect } = require("../middleware/auth");

const router = express.Router();

// Validation rules
const registerRules = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Please enter a valid email"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
];

const loginRules = [
  body("email").isEmail().withMessage("Please enter a valid email"),
  body("password").notEmpty().withMessage("Password is required"),
];

// Public routes
router.post("/register", registerRules, register);
router.post("/login", loginRules, login);

// Protected routes
router.get("/me", protect, getMe);
router.put("/me", protect, updateMe);

module.exports = router;
