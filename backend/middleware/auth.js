// Simple auth middleware: verifies Authorization: Bearer <token>
// If token valid -> sets req.user = decoded payload (usually contains user id)
// If no token or invalid -> moves on without blocking (use requireAuth wrapper if you need protected-only)
const jwt = require('jsonwebtoken');

module.exports = function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers && req.headers.authorization;
    if (!authHeader) return next();

    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0].toLowerCase() !== 'bearer') return next();

    const token = parts[1];
    if (!token) return next();

    // Verify token using JWT_SECRET from env (dotenv should already be loaded in server.js)
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.warn('JWT_SECRET not set - skipping token verification');
      return next();
    }

    try {
      const payload = jwt.verify(token, secret);
      // attach decoded token payload to req.user
      req.user = payload;
    } catch (err) {
      // invalid token — do not throw, just continue without user
      console.warn('Invalid JWT:', err.message);
    }
  } catch (err) {
    console.error('Auth middleware error:', err);
  } finally {
    return next();
  }
};