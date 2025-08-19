const Order = require("../models/Order");
const Warehouse = require("../models/WareHouse");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
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
    const token = jwt.sign({ id: accountant._id, role: "Accountant" }, SECRET, {
      expiresIn: "1d",
    });

    // Optional: Set cookie for secure login
    res.cookie("accountantToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
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
        role: "Accountant",
        token,
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server error during login",
      error: err.message,
    });
  }
};

// Get dispatched orders
const getDispatchedOrders = async (req, res) => {
  try {
    const warehouse = await Warehouse.findOne({ accountant: req.user.id });
    if (!warehouse) {
      return res.status(404).json({
        success: false,
        message: "Warehouse not assigned to this accountant",
      });
    }

    const orders = await Order.find({
      assignedWarehouse: warehouse._id,
      orderStatus: "Dispatched",
      invoiceGenerated: false,
      dueAmount: { $gt: 0 },
    })
      .populate("item", "name category")
      .populate("party", "name contact")
      .populate("placedBy", "name email");

    res.status(200).json({ success: true, data: orders });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch dispatched orders",
      error: err.message,
    });
  }
};

const getOrderDetails = async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId)
      .populate("party", "name contact")
      .populate("placedBy", "name email")
      .populate("assignedWarehouse", "name location")
      .populate("item", "name category");

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    res.status(200).json({ success: true, data: order });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to get order",
      error: err.message,
    });
  }
};

// Generate Invoice
const generateInvoice = async (req, res) => {
  try {
    const accountantId = req.user.id;
    const { orderId } = req.params;
    const { dueDate } = req.body;

    console.log("accountantId", accountantId);
    console.log("orderId", orderId);
    console.log("dueDate", dueDate);

    const warehouse = await Warehouse.findOne({ accountant: accountantId });
    if (!warehouse) {
      return res.status(404).json({
        success: false,
        message: "Warehouse not found for this accountant",
      });
    }

    const order = await Order.findById(orderId);
    if (!order || String(order.assignedWarehouse) !== String(warehouse._id)) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to invoice this order",
      });
    }

    if (order.invoiceGenerated) {
      return res
        .status(400)
        .json({ success: false, message: "Invoice already generated" });
    }

    order.invoiceGenerated = true;
    order.invoicedBy = accountantId;
    order.dueDate = dueDate || new Date();

    await order.save();

    res.status(200).json({
      success: true,
      message: "Invoice generated successfully",
      data: order,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Invoice generation failed",
      error: err.message,
    });
  }
};

// Get Invoice by Order ID
const getInvoiceDetails = async (req, res) => {
  try {
    const accountantId = req.user.id;
    const { orderId } = req.params;
    console.log("accountantId", accountantId);
    console.log("orderId", orderId);

    const warehouse = await Warehouse.findOne({ accountant: accountantId });
    if (!warehouse) {
      return res
        .status(404)
        .json({ success: false, message: "Warehouse not assigned" });
    }

    const order = await Order.findById(orderId)
      .populate("invoicedBy", "name email")
      .populate("party", "name contact")
      .populate("placedBy", "name")
      .populate("assignedWarehouse", "name")
      .populate("dispatchInfo.dispatchedBy", "name");

    if (
      !order ||
      String(order.assignedWarehouse._id) !== String(warehouse._id)
    ) {
      return res
        .status(403)
        .json({ success: false, message: "Access denied to this order" });
    }

    if (!order.invoiceGenerated) {
      return res
        .status(404)
        .json({ success: false, message: "Invoice not generated yet" });
    }

    res.status(200).json({
      success: true,
      data: {
        orderId: order._id,
        totalAmount: order.totalAmount,
        advanceAmount: order.advanceAmount,
        dueAmount: order.dueAmount,
        dueDate: order.dueDate,
        party: order.party,
        invoicedBy: order.invoicedBy,
        generatedAt: order.updatedAt,
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve invoice",
      error: err.message,
    });
  }
};

const changeActivityStatus = async (req, res) => {
  const id = req.user.id;

  try {
    const accountant = await Accountant.findById(id);
    if (!accountant) {
      return res.status(404).json({
        success: false,
        message: "Accountant not found",
      });
    }
    accountant.isActive = !accountant.isActive;
    await accountant.save();
    res.status(200).json({
      success: true,
      message: "Accountant activity status changed successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong while changing accountant activity status",
      error: error.message,
    });
  }
};

module.exports = {
  loginAccountant,
  getDispatchedOrders,
  generateInvoice,
  getInvoiceDetails,
  changeActivityStatus,
  getOrderDetails,
};
