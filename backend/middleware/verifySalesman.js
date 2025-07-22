const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET;

const verifySalesmanToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Format: Bearer <token>
  
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Access denied. Token missing.",
    });
  }

  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = { id: decoded.id, role: decoded.role || 'Salesman' }; // Uniform structure
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token.",
    });
  }
};

module.exports = { verifySalesmanToken };
