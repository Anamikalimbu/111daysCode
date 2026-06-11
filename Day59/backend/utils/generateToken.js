const jwt = require('jsonwebtoken');

// Generate JWT token containing user id, expires in 7 days
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
};

module.exports = generateToken;