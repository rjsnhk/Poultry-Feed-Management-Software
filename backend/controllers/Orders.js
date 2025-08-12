const orderModel = require("../models/Order");
const Product = require("../models/Product");

const createOrder = async (req, res) => {
  try {
    const {
      item, // product ID
      quantity,
      advanceAmount,
      dueDate,
      paymentMode,
      notes,
      party // { companyName, contactPersonNumber, address }
    } = req.body;

    const placedBy = req.user.id; // from auth middleware

    // Validate party fields
    if (!party?.companyName || !party?.contactPersonNumber || !party?.address) {
      return res.status(400).json({
        success: false,
        message: "Party information is incomplete"
      });
    }

    // Check product existence
    const product = await Product.findById(item);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    // Calculate amounts
    const totalAmount = quantity * product.price;
    const advance = advanceAmount || 0;
    const dueAmount = totalAmount - advance;

    // Create order
    const newOrder = await orderModel.create({
      item, // store product ID, not name
      quantity,
      totalAmount,
      advanceAmount: advance,
      dueAmount,
      dueDate,
      paymentMode,
      notes,
      placedBy,
      party
    });

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      data: newOrder
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to create order",
      error: err.message
    });
  }
};


// Get all orders
// Common populate configuration
const orderPopulateFields = [
  { path: "placedBy", select: "name email" },
  { path: "party", select: "companyName" },
  { path: "approvedBy", select: "name email role" },
  { path: "forwardedByManager", select: "name email role" },
  { path: "forwardedByAuthorizer", select: "name email role" },
  { path: "dispatchInfo.dispatchedBy", select: "name email role" },
  { path: "assignedWarehouse", select: "name location" },
  { path: "invoicedBy", select: "name email role" },
  { path: "paymentCollectedBy", select: "name email role" },
  { path: "canceledBy.user", select: "name email role" }
];

// Get all orders
const getAllOrder = async (req, res) => {
  try {
    const orders = await orderModel
      .find()
      .populate('item', 'name category price')
      .populate(orderPopulateFields)
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "Orders fetched successfully",
      data: orders,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error fetching orders",
      error: err.message,
    });
  }
};

// Get single order details
const getOrderDetails = async (req, res) => {
  try {
    const order = await orderModel
      .findById(req.params.id)
      .populate('item', 'name category price')
      .populate(orderPopulateFields);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Order fetched successfully",
      data: order,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error fetching order details",
      error: err.message,
    });
  }
};


//cancel order
const cancelOrder = async (req, res) => {
  const { id } = req.params;
  const { role, id: userId } = req.user; // from middleware
  const { reason } = req.body;

  if (!reason) {
    return res.status(422).json({
      success: false,
      message: "Cancellation reason is required",
    });
  }

  try {
    const order = await orderModel.findById(id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Prevent duplicate cancellations
    if (order.orderStatus === "Cancelled") {
      return res.status(400).json({
        success: false,
        message: "Order is already cancelled",
      });
    }

    // Set cancellation data
    order.orderStatus = "Cancelled";
    order.canceledBy = {
      role,
      user: userId,
      reason,
      date: new Date(),
    };

    await order.save();

    res.status(200).json({
      success: true,
      message: `Order cancelled successfully by ${role}`,
      data: order,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error cancelling order",
      error: err.message,
    });
  }
};

const getOrdersToApprove = async (req, res) => {
  try {
    const orders = await orderModel
      .find({ orderStatus: "WarehouseAssigned" })
      .populate('item', 'name category price')
      .populate("placedBy", "name email") // Optional: get salesman info
      .populate("assignedWarehouse", "name location") // Optional: get warehouse info
      .populate("party", "name contactPerson") // Optional: party info
      .sort({ createdAt: -1 });

    if (!orders.length) {
      return res.status(200).json({
        success: true,
        message: "No orders pending approval",
        data: [],
      });
    }

    res.status(200).json({
      success: true,
      message: "Orders pending approval fetched successfully",
      data: orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching orders awaiting approval",
      error: error.message,
    });
  }
};

const approveOrderToWarehouse = async (req, res) => {
  try {
    const { orderId } = req.body;
    const adminId = req.user.adminId; // Make sure your middleware sets req.user correctly

    // Validate input
    if (!orderId) {
      return res.status(422).json({
        success: false,
        message: "Order ID is required",
      });
    }

    // Find order
    const order = await orderModel.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Check order status
    if (order.orderStatus !== "WarehouseAssigned") {
      return res.status(400).json({
        success: false,
        message: `Order is not in 'WarehouseAssigned' status, current status: ${order.orderStatus}`,
      });
    }

    // Approve order
    order.orderStatus = "Approved";
    order.approvedBy = adminId;
    await order.save();

    res.status(200).json({
      success: true,
      message: "Order approved successfully",
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error approving the warehouse for this order",
      error: error.message,
    });
  }
};

module.exports = {
  createOrder,
  getAllOrder,
  getOrderDetails,
  cancelOrder,
  getOrdersToApprove,
  approveOrderToWarehouse,
};
