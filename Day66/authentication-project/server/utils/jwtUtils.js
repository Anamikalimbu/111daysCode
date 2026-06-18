const jwt = require('jsonwebtoken');

/**
 * Generate a JWT token and set it as an HTTP-only cookie
 */
const generateTokenAndSetCookie = (res, userId, rememberMe = false) => {
  const expiresIn = rememberMe ? '30d' : process.env.JWT_EXPIRE || '7d';

  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn,
  });

  const maxAge = rememberMe
    ? 30 * 24 * 60 * 60 * 1000   // 30 days
    : 7 * 24 * 60 * 60 * 1000;   // 7 days

  res.cookie('jwt', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge,
  });

  return token;
};

module.exports = { generateTokenAndSetCookie };