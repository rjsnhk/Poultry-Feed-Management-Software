const orderModel = require("../models/Order");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const PlantHead = require('../models/PlantHead');
const Warehouse = require('../models/WareHouse');
const SECRET_TOKEN = process.env.JWT_SECRET;


// Login Plant Head
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

// Get all orders assigned to the plant head's warehouse
const getAllOrders = async (req, res) => {
  try {
    const plantHeadId = req.user.id;

    const warehouse = await Warehouse.findOne({ plantHead: plantHeadId });
    if (!warehouse) {
      return res.status(404).json({ success: false, message: "Warehouse not found" });
    }

    const orders = await Order.find({
      assignedWarehouse: warehouse._id,
      orderStatus: { $in: ['WarehouseAssigned', 'Approved'] }
    })
      .populate('party', 'name contact')
      .populate('placedBy', 'name email')
      .populate('item', 'name category');

    res.status(200).json({ success: true, data: orders });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch orders", error: err.message });
  }
};


// Get order details
const getOrderDetails = async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId)
      .populate('party', 'name contact')
      .populate('placedBy', 'name email')
      .populate('item', 'name category');

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    res.status(200).json({ success: true, data: order });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to get order", error: err.message });
  }
};


// Update stock for a product

const updateProductStock = async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;
    const plantHeadId = req.user.id;

    if (quantity < 0) {
      return res.status(400).json({ success: false, message: 'Quantity must be non-negative' });
    }

    const warehouse = await Warehouse.findOne({ plantHead: plantHeadId });
    if (!warehouse) {
      return res.status(404).json({ success: false, message: 'Warehouse not found' });
    }

    const stockItem = warehouse.stock.find(item => item.product.toString() === productId);
    if (!stockItem) {
      return res.status(404).json({ success: false, message: 'Product not found in your warehouse' });
    }

    stockItem.quantity += quantity;
    stockItem.lastUpdated = new Date();

    await warehouse.save();

    res.status(200).json({ success: true, message: 'Stock quantity updated successfully' });

  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update stock', error: err.message });
  }
};



// Get all products in the warehouse
const getAllProductsInWarehouse = async (req, res) => {
  try {
    const plantHeadId = req.user.id;

    const warehouse = await Warehouse.findOne({ plantHead: plantHeadId }).populate('stock.product');
    if (!warehouse) {
      return res.status(404).json({ success: false, message: 'Warehouse not found' });
    }

    const products = warehouse.stock.map(item => ({
      productId: item.product._id,
      name: item.product.name,
      category: item.product.category,
      description: item.product.description,
      quantity: item.quantity,
      price: item.price,
    }));

    res.status(200).json({ success: true, data: products });

  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to get products', error: err.message });
  }
};


// Dispatch order with transport info
const dispatchOrder = async (req, res) => {
  try {
    const plantHeadId = req.user.id;
    const { orderId } = req.params;
    const { vehicleNumber, driverName, driverContact, transportCompany } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    if (order.orderStatus !== "Approved") {
      return res.status(400).json({ success: false, message: "Order is not ready to dispatch" });
    }

    order.dispatchInfo = {
      dispatchedBy: plantHeadId,
      dispatchDate: new Date(),
      vehicleNumber,
      driverName,
      driverContact,
      transportCompany,

    };
    order.orderStatus = "Dispatched";

    await order.save();

    res.status(200).json({ success: true, message: "Order dispatched successfully", data: order });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to dispatch order", error: err.message });
  }
};


// Get all dispatched orders
const getDispatchedOrders = async (req, res) => {
  try {
    const plantHeadId = req.user.id;

    const orders = await orderModel.find({
      'dispatchInfo.dispatchedBy': plantHeadId,
      orderStatus: 'Dispatched'
    }).populate('party', 'name contact')
      .populate('placedBy', 'name');

    res.status(200).json({ success: true, data: orders });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch dispatched orders", error: err.message });
  }
};


module.exports = {
  loginPlantHead,
  getAllOrders,
  getOrderDetails,
  getAllProductsInWarehouse,
  updateProductStock,
  dispatchOrder,
  getDispatchedOrders
};