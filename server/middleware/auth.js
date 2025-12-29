// server/middleware/auth.js
const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
  // 1. Get token from the autorization header
  const authHeader = req.header('Authorization');

  // 2. Check if there is no header or if it is in the wrong format
  if (!authHeader || !authHeader.startsWith('Bearer')) {
    return res.status(401).json({ error: 'No token, authorization denied.' });
  }
  //extract the token from the bearer <token> string
  const token = authHeader.split(' ')[1];

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