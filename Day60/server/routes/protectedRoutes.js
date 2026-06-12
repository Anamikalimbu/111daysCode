const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');

// Public route — anyone can access
router.get('/public', (req, res) => {
  res.json({ message: 'This is a public route. No token required.' });
});

// Protected route — requires valid JWT
router.get('/profile', protect, (req, res) => {
  res.json({
    message: 'Welcome to your profile!',
    user: req.user, // { id, role, iat, exp }
  });
});

// Protected + role-restricted route
router.get('/admin', protect, authorize('admin'), (req, res) => {
  res.json({ message: 'Welcome, admin. This is sensitive data.' });
});

module.exports = router;