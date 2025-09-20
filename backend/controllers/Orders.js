const orderModel = require("../models/Order");
const imagekit = require("../config/imagekit.js");
const Product = require("../models/Product");
const Party = require("../models/Party.js");
const WareHouse = require("../models/WareHouse.js");
const getNextOrderId = require("../helper/getNextOrderId");

const createOrder = async (req, res) => {
  try {
    const {
      items,
      advanceAmount,
      dueDate,
      paymentMode,
      notes,
      party,
      discount,
    } = req.body;

    const orderId = await getNextOrderId();
    const parsedParty = JSON.parse(party);
    const parsedItems = JSON.parse(items);
    const placedBy = req.user.id;

    // ✅ Validate party fields
    if (
      !parsedParty?.companyName ||
      !parsedParty?.contactPersonNumber ||
      !parsedParty?.address
    ) {
      return res.status(400).json({
        success: false,
        message: "Party information is incomplete",
      });
    }

    // ✅ Handle advance payment proof
    let advancePaymentProof;
    if (req.file?.buffer) {
      advancePaymentProof = await imagekit.upload({
        file: req.file.buffer,
        fileName: req.file.originalname,
        folder: "/advanceAmountDocs",
      });
    }

    // ✅ Validate products + calculate total
    let totalAmount = 0;
    for (const i of parsedItems) {
      const product = await Product.findById(i.product);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product with id ${i.product} not found`,
        });
      }
      totalAmount += i.quantity * product.price;
    }

    // Apply discount (if any)
    if (discount > 0) {
      totalAmount = totalAmount - (totalAmount * discount) / 100;
    }

    // ✅ Calculate advance + due
    const advance = Number(advanceAmount) || 0;
    const dueAmount = Number(totalAmount) - advance;

    // ✅ Determine payment statuses
    let paymentStatus;
    let advancePaymentStatus;
    let duePaymentStatus;

    if (advance === totalAmount && dueAmount === 0) {
      paymentStatus = "ConfirmationPending";
      advancePaymentStatus = "Pending";
    } else if (advance > 0 && advance < totalAmount && dueAmount > 0) {
      paymentStatus = "PendingDues";
      advancePaymentStatus = "Pending";
      duePaymentStatus = "Pending";
    } else if (advance === 0 && dueAmount > 0) {
      paymentStatus = "PendingDues";
      advancePaymentStatus = "Pending";
      duePaymentStatus = "Pending";
    }

    let duePaymentMode = dueAmount > 0 ? "Not Paid" : null;

    // ✅ Update Party balance (loan/credit limit)
    await Party.findByIdAndUpdate(parsedParty._id, {
      limit: Number(parsedParty.limit) - Number(dueAmount),
    });

    console.log(paymentMode);

    // ✅ Build Order object
    const orderItems = {
      orderId,
      items: parsedItems.map((i) => ({
        product: i.product,
        quantity: i.quantity,
      })),
      totalAmount,
      advanceAmount: advance,
      dueAmount,
      dueDate,
      paymentMode,
      duePaymentMode,
      notes,
      paymentStatus,
      advancePaymentStatus,
      duePaymentStatus,
      placedBy,
      discount,
      party: parsedParty,
    };

    if (advancePaymentProof) {
      orderItems.advancePaymentDoc = advancePaymentProof.url;
    }

    console.log(orderItems);

    const newOrder = await orderModel.create(orderItems);

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      data: newOrder,
    });
  } catch (err) {
    console.error("Error creating order:", err);
    res.status(500).json({
      success: false,
      message: "Failed to create order",
      error: err.message,
    });
  }
};

// Get all orders
// Common populate configuration
const orderPopulateFields = [
  { path: "placedBy", select: "name email" },
  { path: "party", select: "companyName contactPersonNumber address" },
  { path: "approvedBy", select: "name email role" },
  { path: "forwardedByManager", select: "name email role" },
  { path: "forwardedByAuthorizer", select: "name email role" },
  { path: "dispatchInfo.dispatchedBy", select: "name email role" },
  { path: "assignedWarehouse", select: "name location" },
  { path: "invoiceDetails.invoicedBy", select: "name email role" },
  { path: "paymentCollectedBy", select: "name email role" },
  { path: "canceledBy.user", select: "name email role" },
];

// Get all orders
const getAllOrder = async (req, res) => {
  try {
    const orders = await orderModel
      .find()
      .populate("items.product", "name category price")
      .populate(orderPopulateFields)
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "Orders fetched successfully",
      data: orders,
    });
  } catch (err) {
    console.log(err.message);
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
      .populate("items.product", "name category price")
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
  const { orderId } = req.params;
  const { role, id: userId } = req.user; // from middleware
  const { reason } = req.body;

  if (!reason) {
    return res.status(422).json({
      success: false,
      message: "Cancellation reason is required",
    });
  }

  try {
    const order = await orderModel.findById(orderId);
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
      .populate("items.product", "name category price")
      .populate("placedBy", "name email")
      .populate("assignedWarehouse", "name location")
      .populate("party", "name contactPerson")
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
    const AuthorizerId = req.user.id;

    // Validate input
    if (!orderId) {
      return res.status(422).json({
        success: false,
        message: "Order ID is required",
      });
    }

    // Find order
    const order = await orderModel.findById(orderId).populate("items.product");
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

    // Get assigned warehouse
    const warehouse = await WareHouse.findById(
      order.assignedWarehouse
    ).populate("stock.product");
    if (!warehouse) {
      return res.status(404).json({
        success: false,
        message: "Warehouse not found",
      });
    }

    let insufficientStock = [];

    // Step 1: Check all items availability
    order.items.forEach((orderItem) => {
      const stockItem = warehouse.stock.find(
        (s) => String(s.product._id) === String(orderItem.product._id)
      );

      if (!stockItem || stockItem.quantity < orderItem.quantity) {
        insufficientStock.push({
          product: orderItem.product.name,
          requested: orderItem.quantity,
          available: stockItem ? stockItem.quantity : 0,
        });
      }
    });

    // Agar stock nahi hai toh error
    if (insufficientStock.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Insufficient stock in warehouse",
        insufficientStock,
      });
    }

    // Step 2: Reduce stock quantities
    order.items.forEach((orderItem) => {
      const stockItem = warehouse.stock.find(
        (s) => String(s.product._id) === String(orderItem.product._id)
      );
      stockItem.quantity -= orderItem.quantity;
    });

    // Step 3: Approve order
    order.orderStatus = "Approved";
    order.approvedBy = AuthorizerId;

    if (order.advanceAmount > 0 && order.advancePaymentDoc) {
      order.advancePaymentStatus = "SentForApproval";
      order.advancePaymentApprovalSentTo = warehouse.accountant;
    }

    await warehouse.save();
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
