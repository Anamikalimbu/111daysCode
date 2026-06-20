import User from "../models/User.js";
import { generateToken, generateSecureToken, hashToken } from "../utils/generateToken.js";
import { sendEmail, buildVerificationEmail, buildResetPasswordEmail } from "../utils/sendEmail.js";

const VERIFICATION_EXPIRY_MS = 24 * 60 * 60 * 1000; // 24 hours
const RESET_EXPIRY_MS = 60 * 60 * 1000; // 1 hour

const setTokenCookie = (res, token) => {
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "Name, email, and password are required" });
    }
    if (password.length < 8) {
      return res.status(400).json({ success: false, message: "Password must be at least 8 characters" });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({ success: false, message: "An account with this email already exists" });
    }

    const { rawToken, hashedToken } = generateSecureToken();

    const user = await User.create({
      name,
      email,
      password,
      verificationToken: hashedToken,
      verificationTokenExpires: Date.now() + VERIFICATION_EXPIRY_MS,
    });

    const verifyUrl = `${process.env.CLIENT_URL}/verify-email/${rawToken}`;

    try {
      await sendEmail({
        to: user.email,
        subject: "Verify your SecureAuth account",
        html: buildVerificationEmail(user.name, verifyUrl),
      });
    } catch (emailError) {
      console.error("Failed to send verification email:", emailError.message);
      // Registration still succeeds; user can request a resend later.
    }

    res.status(201).json({
      success: true,
      message: "Registration successful. Please check your email to verify your account.",
      user: user.toSafeObject(),
    });
  } catch (error) {
    next(error);
  }
};

// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select("+password");
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    if (!user.isVerified) {
      return res.status(403).json({
        success: false,
        message: "Please verify your email before logging in",
        unverified: true,
      });
    }

    const token = generateToken(user._id);
    setTokenCookie(res, token);

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: user.toSafeObject(),
    });
  } catch (error) {
    next(error);
  }
};

// @route   POST /api/auth/logout
// @access  Private
export const logoutUser = async (req, res, next) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });
    res.status(200).json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/auth/verify-email/:token
// @access  Public
export const verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.params;
    const hashedToken = hashToken(token);

    const user = await User.findOne({
      verificationToken: hashedToken,
      verificationTokenExpires: { $gt: Date.now() },
    }).select("+verificationToken +verificationTokenExpires");

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Verification link is invalid or has expired",
      });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    await user.save();

    res.status(200).json({ success: true, message: "Email verified successfully. You can now log in." });
  } catch (error) {
    next(error);
  }
};

// @route   POST /api/auth/resend-verification
// @access  Public
export const resendVerification = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: email?.toLowerCase() });

    if (!user) {
      return res.status(404).json({ success: false, message: "No account found with this email" });
    }
    if (user.isVerified) {
      return res.status(400).json({ success: false, message: "This account is already verified" });
    }

    const { rawToken, hashedToken } = generateSecureToken();
    user.verificationToken = hashedToken;
    user.verificationTokenExpires = Date.now() + VERIFICATION_EXPIRY_MS;
    await user.save();

    const verifyUrl = `${process.env.CLIENT_URL}/verify-email/${rawToken}`;
    await sendEmail({
      to: user.email,
      subject: "Verify your SecureAuth account",
      html: buildVerificationEmail(user.name, verifyUrl),
    });

    res.status(200).json({ success: true, message: "Verification email resent. Please check your inbox." });
  } catch (error) {
    next(error);
  }
};

// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: email?.toLowerCase() });

    // Respond the same way whether or not the user exists, to avoid leaking which emails are registered
    const genericResponse = {
      success: true,
      message: "If an account exists for this email, a password reset link has been sent.",
    };

    if (!user) {
      return res.status(200).json(genericResponse);
    }

    const { rawToken, hashedToken } = generateSecureToken();
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = Date.now() + RESET_EXPIRY_MS;
    await user.save();

    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${rawToken}`;

    try {
      await sendEmail({
        to: user.email,
        subject: "Reset your SecureAuth password",
        html: buildResetPasswordEmail(user.name, resetUrl),
      });
    } catch (emailError) {
      console.error("Failed to send password reset email:", emailError.message);
    }

    res.status(200).json(genericResponse);
  } catch (error) {
    next(error);
  }
};

// @route   POST /api/auth/reset-password/:token
// @access  Public
export const resetPassword = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password || password.length < 8) {
      return res.status(400).json({ success: false, message: "Password must be at least 8 characters" });
    }

    const hashedToken = hashToken(token);

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    }).select("+resetPasswordToken +resetPasswordExpires");

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Password reset link is invalid or has expired",
      });
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({ success: true, message: "Password reset successfully. You can now log in." });
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/auth/profile
// @access  Private
export const getProfile = async (req, res, next) => {
  try {
    res.status(200).json({ success: true, user: req.user.toSafeObject() });
  } catch (error) {
    next(error);
  }
};
