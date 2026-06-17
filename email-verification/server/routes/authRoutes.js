const express = require('express');
const router = express.Router();
const {
  register,
  login,
  verifyEmail,
  resendVerification,
  getProfile,
} = require('../controllers/authController');
const { protect, requireVerified } = require('../middleware/authMiddleware');

// Public routes
router.post('/register', register);
router.post('/login', login);
router.get('/verify/:token', verifyEmail);
router.post('/resend-verification', resendVerification);

// Protected routes (JWT required + email must be verified)
router.get('/profile', protect, requireVerified, getProfile);

module.exports = router;