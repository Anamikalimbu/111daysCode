const User = require("../models/User");
const { verifyToken } = require("../utils/jwt");

/**
 * Middleware: Protect routes — verifies JWT token
 * Attaches the authenticated user to req.user
 */
const protect = async (req, res, next) => {
  try {
    let token;

    // Check for Bearer token in Authorization header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access denied. No token provided. Please log in.",
      });
    }

    // Verify token
    const decoded = verifyToken(token);

    // Fetch user from DB (ensures user still exists + gets fresh role)
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User belonging to this token no longer exists.",
      });
    }

    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: "Your account has been deactivated. Contact an administrator.",
      });
    }

    req.user = user; // Attach user to request
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Your session has expired. Please log in again.",
      });
    }
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Invalid token. Please log in again.",
      });
    }
    next(error);
  }
};

/**
 * Middleware: Restrict access to specific roles
 * Usage: authorize("admin") or authorize("admin", "moderator")
 * Must be used AFTER protect middleware
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access forbidden. Required role: [${roles.join(", ")}]. Your role: ${req.user.role}`,
      });
    }
    next();
  };
};

module.exports = { protect, authorize };