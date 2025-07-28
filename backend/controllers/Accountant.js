const Order = require('../models/Order');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const SECRET = process.env.JWT_SECRET;
const Accountant = require("../models/Accountant");
// Login Accountant
const loginAccountant = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Input validation
    if (!email || !password) {
      return res.status(422).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // Find accountant
    const accountant = await Accountant.findOne({ email });
    if (!accountant) {
      return res.status(404).json({
        success: false,
        message: "No Accountant found with this email",
      });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, accountant.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Incorrect password",
      });
    }

    // Generate token
    const token = jwt.sign(
      { id: accountant._id, role: 'Accountant' },
      SECRET,
      { expiresIn: '1d' }
    );

    // Optional: Set cookie for secure login
    res.cookie("accountantToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    // Respond
    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        _id: accountant._id,
        name: accountant.name,
        email: accountant.email,
        role: 'Accountant',
        token
      }
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server error during login",
      error: err.message
    });
  }
};



// Get dispatched orders
const getDispatchedOrders = async (req, res) => {};

// Generate Invoice
const generateInvoice = async (req, res) => {};

// Get Invoice by Order ID
const getInvoiceDetails = async (req, res) => {};

module.exports = {
  loginAccountant,
  getDispatchedOrders,
  generateInvoice,
  getInvoiceDetails
};
