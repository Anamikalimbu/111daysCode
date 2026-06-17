const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { sendVerificationEmail } = require('../utils/sendEmail');

// Helper: Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

// Helper: Generate a secure random token
const generateVerificationToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate fields
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'All fields are required.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters.' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      if (existingUser.isVerified) {
        return res.status(409).json({ success: false, message: 'An account with this email already exists.' });
      } else {
        // User exists but not verified — resend verification
        const token = generateVerificationToken();
        const expiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
        existingUser.verificationToken = token;
        existingUser.verificationTokenExpiry = expiry;
        await existingUser.save({ validateBeforeSave: false });

        await sendVerificationEmail({ name: existingUser.name, email, token });

        return res.status(200).json({
          success: true,
          message: 'Account already exists but is not verified. A new verification email has been sent.',
        });
      }
    }

    // Create verification token
    const verificationToken = generateVerificationToken();
    const verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      verificationToken,
      verificationTokenExpiry,
    });

    // Send verification email
    await sendVerificationEmail({ name, email, token: verificationToken });

    res.status(201).json({
      success: true,
      message: 'Registration successful! Please check your email to verify your account.',
    });
  } catch (error) {
    console.error('Register error:', error);
    if (error.code === 11000) {
      return res.status(409).json({ success: false, message: 'Email already in use.' });
    }
    res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    // Get user with password
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    // Block unverified users
    if (!user.isVerified) {
      return res.status(403).json({
        success: false,
        message: 'Please verify your email before logging in.',
        needsVerification: true,
        email: user.email,
      });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Login successful!',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
};

// @desc    Verify email via token
// @route   GET /api/auth/verify/:token
// @access  Public
const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Verification link is invalid or has expired.',
      });
    }

    if (user.isVerified) {
      return res.status(200).json({
        success: true,
        message: 'Email is already verified. You can log in.',
      });
    }

    // Mark as verified and clear token
    user.isVerified = true;
    user.verificationToken = null;
    user.verificationTokenExpiry = null;
    await user.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      message: 'Email verified successfully! You can now log in.',
    });
  } catch (error) {
    console.error('Verify error:', error);
    res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
};

// @desc    Resend verification email
// @route   POST /api/auth/resend-verification
// @access  Public
const resendVerification = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required.' });
    }

    const user = await User.findOne({ email });

    if (!user) {
      // Don't reveal if email exists for security
      return res.status(200).json({
        success: true,
        message: 'If that email is registered, a verification link has been sent.',
      });
    }

    if (user.isVerified) {
      return res.status(400).json({
        success: false,
        message: 'This email is already verified.',
      });
    }

    // Generate new token
    const token = generateVerificationToken();
    const expiry = new Date(Date.now() + 24 * 60 * 60 * 1000);

    user.verificationToken = token;
    user.verificationTokenExpiry = expiry;
    await user.save({ validateBeforeSave: false });

    await sendVerificationEmail({ name: user.name, email, token });

    res.status(200).json({
      success: true,
      message: 'Verification email sent! Please check your inbox.',
    });
  } catch (error) {
    console.error('Resend error:', error);
    res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
};

// @desc    Get current user profile (protected)
// @route   GET /api/auth/profile
// @access  Private
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isVerified: user.isVerified,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

module.exports = { register, login, verifyEmail, resendVerification, getProfile };