import jwt from "jsonwebtoken";
import crypto from "crypto";

// Generate a signed JWT for a given user id
export const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

// Generate a secure random token (used for email verification / password reset)
// Returns both the raw token (sent to the user via email/link) and a hashed
// version (stored in the DB), so the DB never holds a usable token directly.
export const generateSecureToken = () => {
  const rawToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");
  return { rawToken, hashedToken };
};

export const hashToken = (rawToken) => {
  return crypto.createHash("sha256").update(rawToken).digest("hex");
};
