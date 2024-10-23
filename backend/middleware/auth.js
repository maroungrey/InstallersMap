const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
  // Get token from multiple sources
  const token = req.header('x-auth-token') || 
                req.session?.token || 
                req.cookies?.token;

  // Check if not token
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.id }; // Match the token payload structure
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};