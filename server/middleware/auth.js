// server/middleware/auth.js
const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
  // 1. Get token from the header
  const token = req.header('x-auth-token');

  // 2. Check if there is no token
  if (!token) {
    return res.status(401).json({ error: 'No token, authorization denied.' });
  }

  // 3. If there is a token, verify it
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Add the user payload to the request object
    req.user = decoded.user; 
    
    // Call next() to proceed to the actual route handler
    next(); 

  } catch (err) {
    res.status(401).json({ error: 'Token is not valid.' });
  }
};