const crypto = require("crypto");
const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const { generateToken } = require("../utils/generateToken");
const { sendEmail, getResetEmailHTML } = require("../utils/sendEmail");

// ─── Register ───────────────────────────────────────────────────────────────
const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please provide name, email, and password");
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("Email already registered");
  }

  const user = await User.create({ name, email, password });

  res.status(201).json({
    success: true,
    message: "Account created successfully",
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    },
  });
});

// ─── Login ───────────────────────────────────────────────────────────────────
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("Please provide email and password");
  }

  // Need to explicitly select password (it's excluded by default)
  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  res.json({
    success: true,
    message: "Login successful",
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    },
  });
});

// ─── Forgot Password ─────────────────────────────────────────────────────────
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    res.status(400);
    throw new Error("Please provide your email address");
  }

  const user = await User.findOne({ email });

  // Always respond the same to prevent email enumeration attacks
  if (!user) {
    return res.json({
      success: true,
      message:
        "If an account with that email exists, a reset link has been sent.",
    });
  }

  // Generate raw token
  const resetToken = crypto.randomBytes(32).toString("hex");

  // Hash and store
  user.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // Expire in 10 minutes
  user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

  await user.save({ validateBeforeSave: false });

  const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

  try {
    await sendEmail({
      to: user.email,
      subject: "🔐 Password Reset Request — SecureAuth",
      html: getResetEmailHTML(user.name, resetUrl),
    });

    res.json({
      success: true,
      message:
        "If an account with that email exists, a reset link has been sent.",
      // expose token in dev only for easy testing (REMOVE in production!)
      ...(process.env.NODE_ENV !== "production" && {
        devResetUrl: resetUrl,
        devToken: resetToken,
      }),
    });
  } catch (err) {
    // Rollback token on email failure
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });

    res.status(500);
    throw new Error("Email could not be sent. Please try again.");
  }
});

// ─── Reset Password ───────────────────────────────────────────────────────────
const resetPassword = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  if (!password) {
    res.status(400);
    throw new Error("Please provide a new password");
  }

  if (password.length < 6) {
    res.status(400);
    throw new Error("Password must be at least 6 characters");
  }

  // Hash the incoming raw token to compare with stored hash
  const hashedToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpire: { $gt: Date.now() },
  }).select("+resetPasswordToken +resetPasswordExpire");

  if (!user) {
    res.status(400);
    throw new Error("Reset link is invalid or has expired");
  }

  // Update password & clear reset fields
  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  res.json({
    success: true,
    message: "Password reset successful. You can now log in.",
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    },
  });
});

// ─── Get Profile (Protected) ──────────────────────────────────────────────────
const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  res.json({
    success: true,
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    },
  });
});

module.exports = { register, login, forgotPassword, resetPassword, getProfile };