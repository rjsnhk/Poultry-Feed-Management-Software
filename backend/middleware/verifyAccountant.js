const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET;

const verifyAccountant = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Bearer <token>
  
  if (!token) {
    return res.status(401).json({ success: false, message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, SECRET);

    // Attach accountant info to req.user (consistent with other middlewares)
    req.user = {
      id: decoded.id,
      role: decoded.role || 'Accountant'
    };

    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: "Invalid or expired token." });
  }
};

module.exports = { verifyAccountant };
