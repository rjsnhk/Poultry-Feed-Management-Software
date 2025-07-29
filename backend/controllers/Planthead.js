const orderModel = require("../models/Order");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const PlantHead = require('../models/PlantHead');
const Warehouse = require('../models/Warehouse');
const SECRET_TOKEN = process.env.JWT_SECRET;

// PlantHead Login
const loginPlantHead = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(422).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // Find plant head
    const plantHead = await PlantHead.findOne({ email });
    if (!plantHead) {
      return res.status(404).json({
        success: false,
        message: "Plant Head not found",
      });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, plantHead.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Incorrect password",
      });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: plantHead._id, role: 'PlantHead' },
      SECRET_TOKEN,
      { expiresIn: '1d' }
    );

    // Optional: set cookie
    res.cookie("plantHeadToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    // Final response
    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        _id: plantHead._id,
        name: plantHead.name,
        email: plantHead.email,
        role: 'PlantHead',
        token
      }
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Something went wrong during login",
      error: err.message
    });
  }
};


// Daily Production Entry (Update stock)
const updateStock = async (req, res) => {
  
};

// View Production Chart (stock overview)
const getProductionChart = async (req, res) => {};

// Dispatch Order
const dispatchOrder = async (req, res) => {};

// Upload Vehicle Info & Photo
const uploadTransportInfo = async (req, res) => {};


// Get all dispatched orders
const getDispatchedOrders = async (req, res) => {};


module.exports = {
  loginPlantHead,
  updateStock,
  getProductionChart,
  dispatchOrder,
  uploadTransportInfo,
  getDispatchedOrders
};