const Salesman = require('../models/Salesman');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');


const Order = require("../models/Order");

const Warehouse = require('../models/WareHouse');

const SalesAuthorizer = require('../models/SalesAuthorizer');

const SECRET_TOKEN = process.env.JWT_SECRET || "yourSecretKey";

const loginSalesAuthorizer = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Input validation
    if (!email || !password) {
      return res.status(422).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // Find sales authorizer
    const authorizer = await SalesAuthorizer.findOne({ email });
    if (!authorizer) {
      return res.status(404).json({
        success: false,
        message: "Sales Authorizer not found",
      });
    }

    // Validate password
    const isMatch = await bcrypt.compare(password, authorizer.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Incorrect password",
      });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: authorizer._id, role: 'SalesAuthorizer' },
      SECRET_TOKEN,
      { expiresIn: '1d' }
    );

    // Set cookie (optional)
    res.cookie("salesAuthorizerToken", token, {
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
        _id: authorizer._id,
        name: authorizer.name,
        email: authorizer.email,
        role: 'SalesAuthorizer',
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

const getForwardedOrders = async (req, res) => {
  try {
    const authorizerId = req.user.id;

    const orders = await Order.find({
      orderStatus: "ForwardedToAuthorizer",
      forwardedByManager: { $exists: true },
      forwardedByAuthorizer: { $exists: false }
    })
    .populate("placedBy", "name email")
    .populate("party", "name contact");

    res.status(200).json({ success: true, data: orders });
  } catch (err) {
    res.status(500).json({ success: false, message: "Fetch error", error: err.message });
  }
};


// 3. View single order
const getOrderDetails = async (req, res) => {
  try {
    const orderId = req.params.orderId;

    const order = await Order.findById(orderId)
      .populate("placedBy", "name email")
      .populate("party", "name contact")
      .populate("assignedWarehouse", "name location");

    if (!order) return res.status(404).json({ success: false, message: "Order not found" });

    res.status(200).json({ success: true, data: order });
  } catch (err) {
    res.status(500).json({ success: false, message: "Fetch error", error: err.message });
  }
};


// 4. Assign warehouse to order
const assignWarehouse = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { warehouseId } = req.body;
    const authorizerId = req.user.id;

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });
    if (order.orderStatus !== "ForwardedToAuthorizer") {
      return res.status(400).json({ success: false, message: "Cannot assign warehouse at this stage" });
    }

    order.assignedWarehouse = warehouseId;
    order.orderStatus = "WarehouseAssigned";
    order.forwardedByAuthorizer = authorizerId;
    await order.save();

    res.status(200).json({ success: true, message: "Warehouse assigned", data: order });
  } catch (err) {
    res.status(500).json({ success: false, message: "Assignment failed", error: err.message });
  }
};


// 5. Get warehouse assignment history
const getAssignmentHistory = async (req, res) => {
  try {
    const authorizerId = req.user.id;

    const orders = await Order.find({
      forwardedByAuthorizer: authorizerId,
      assignedWarehouse: { $exists: true }
    })
    .populate("assignedWarehouse", "name location")
    .select("assignedWarehouse orderStatus createdAt");

    res.status(200).json({ success: true, data: orders });
  } catch (err) {
    res.status(500).json({ success: false, message: "History fetch error", error: err.message });
  }
};


const checkWarehouseApproval = async (req, res) => {
  try {
    const orderId = req.params.orderId;

    const order = await Order.findById(orderId)
      .select("orderStatus approvedBy assignedWarehouse");

    if (!order) return res.status(404).json({ success: false, message: "Order not found" });

    const approved = order.orderStatus === "Approved" && order.approvedBy;
    res.status(200).json({ success: true, data: { approved, orderStatus: order.orderStatus } });
  } catch (err) {
    res.status(500).json({ success: false, message: "Check failed", error: err.message });
  }
};



module.exports = {
  loginSalesAuthorizer,
  getForwardedOrders,
  getOrderDetails,
  assignWarehouse,
  getAssignmentHistory,
  checkWarehouseApproval
};