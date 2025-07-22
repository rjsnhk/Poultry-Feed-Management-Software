const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET;

const verifySalesmanager = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ success: false, message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = { id: decoded.id, role: decoded.role || 'SalesManager' };
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: "Invalid or expired token." });
  }
};

module.exports = { verifySalesmanager };
