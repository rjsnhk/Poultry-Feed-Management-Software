const SalesManager = require('../models/SalesManager');
const Order = require('../models/Order');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const SECRET_TOKEN = process.env.JWT_SECRET;




const loginSalesManager = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Input validation
    if (!email || !password) {
      return res.status(422).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // Find Sales Manager by email
    const manager = await SalesManager.findOne({ email });
    if (!manager) {
      return res.status(404).json({
        success: false,
        message: "Sales Manager not found",
      });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, manager.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Incorrect password",
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: manager._id, role: 'SalesManager' },
      SECRET_TOKEN,
      { expiresIn: '1d' }
    );

    // Set optional cookie
    res.cookie("salesManagerToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    // Response
    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        _id: manager._id,
        name: manager.name,
        email: manager.email,
        role: 'SalesManager',
        token
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong during login",
      error: error.message,
    });
  }
};



// View assigned but unforwarded orders
const getAssignedOrders = async (req, res) => {
  try {
    const orders = await Order.find({ orderStatus: 'Placed' })
      .populate('party', 'name contact')
      .populate('placedBy', 'name email phone');

    res.status(200).json({
      success: true,
      message: "Fetched all orders with status 'Placed'",
      data: orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error while fetching assigned orders",
      error: error.message
    });
  }
};


const getOrderDetails = async (req, res) => {
  const { orderId } = req.params;

  try {
    const order = await Order.findById(orderId)
      .populate('party', 'name contact')
      .populate('placedBy', 'name email phone');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Order details fetched successfully",
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching order details",
      error: error.message
    });
  }
};
// Forward order to Authorizer
const forwardOrderToAuthorizer = async (req, res) => {
  const { orderId } = req.params;
  const salesManagerId = req.user.salesManagerId; // from verifySalesmanager middleware

  try {
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    if (order.orderStatus !== 'Placed') {
      return res.status(400).json({
        success: false,
        message: "Order is not in 'Placed' status"
      });
    }

    // ✅ Update to correct status and assign manager
    order.orderStatus = 'ForwardedToAuthorizer';
    order.forwardedByManager = salesManagerId;

    await order.save();

    res.status(200).json({
      success: true,
      message: "Order forwarded to Authorizer successfully",
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error forwarding order to Authorizer",
      error: error.message
    });
  }
};







// Get all forwarded orders by Sales this particular Manager
const getForwardedOrders = async (req, res) => {
  try {
    const orders = await Order.find({ forwardedByManager: req.user.salesManagerId })
      .populate('party', 'name contact')
      .populate('placedBy', 'name email phone');

    res.status(200).json({
      success: true,
      message: "Fetched all forwarded orders",
      data: orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error while fetching forwarded orders",
      error: error.message
    });
  }
}


module.exports = {
  loginSalesManager,
  getAssignedOrders,
  forwardOrderToAuthorizer,
  getForwardedOrders,
  getOrderDetails
};