import React from 'react';

const SNIPPETS = {
  noToken: `// authMiddleware.js
const authHeader = req.headers.authorization;

if (!authHeader || !authHeader.startsWith('Bearer ')) {
  return res.status(401).json({
    message: 'No token provided. Access denied.'
  });
}`,
  invalidToken: `try {
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.user = decoded;
  next();
} catch (err) {
  // Signature mismatch or malformed token
  return res.status(401).json({ message: 'Invalid token.' });
}`,
  expiredToken: `catch (err) {
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      message: 'Token expired. Please log in again.'
    });
  }
}`,
  wrongRole: `// authorize.js
const authorize = (...allowedRoles) => (req, res, next) => {
  if (!allowedRoles.includes(req.user.role)) {
    return res.status(403).json({
      message: 'Forbidden: insufficient permissions.'
    });
  }
  next();
};

// route
router.get('/admin', protect, authorize('admin'), handler);`,
  success: `// req.user is now available in the handler
router.get('/profile', protect, (req, res) => {
  res.json({ message: 'Welcome!', user: req.user });
});`,
};

export default function CodePanel({ scenario }) {
  return (
    <div className="code-panel">
      <div className="code-panel-header">
        <span className="code-dot" />
        <span className="code-dot" />
        <span className="code-dot" />
        <span className="code-filename">authMiddleware.js</span>
      </div>
      <pre className="code-body"><code>{SNIPPETS[scenario] || SNIPPETS.success}</code></pre>
    </div>
  );
}