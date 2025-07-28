const Salesman = require('../models/Salesman');
const Order = require('../models/Order');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const SECRET_TOKEN = process.env.JWT_SECRET;


const loginSalesman = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Input validation
    if (!email || !password) {
      return res.status(422).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // Find salesman by email
    const salesman = await Salesman.findOne({ email });
    if (!salesman) {
      return res.status(404).json({
        success: false,
        message: "Salesman not found",
      });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, salesman.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Incorrect password",
      });
    }

    // Generate JWT token with uniform structure
    const token = jwt.sign(
      { id: salesman._id, role: 'Salesman' },
      SECRET_TOKEN,
      { expiresIn: '1d' }
    );

    // Optional: Set cookie
    res.cookie("salesmanToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    // Send response
    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        _id: salesman._id,
        name: salesman.name,
        email: salesman.email,
        role: 'Salesman',
        token
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong while logging in",
      error: error.message,
    });
  }
};



const deleteOrder = async (req, res) => {
  const { orderId } = req.params;
  const salesmanId = req.user._id; // set by verifySalesmanToken middleware

  if (!orderId) {
    return res.status(400).json({
      success: false,
      message: "Order ID is required",
    });
  }

  try {
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Check if the logged-in salesman placed the order
    if (order.placedBy.toString() !== salesmanId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized. You can only delete your own orders.",
      });
    }

    // Prevent deletion if order is already forwarded
    const forwardSteps = ['ForwardedToAuthorizer', 'WarehouseAssigned', 'Approved', 'Dispatched', 'Delivered', 'Paid'];
    if (forwardSteps.includes(order.orderStatus)) {
      return res.status(403).json({
        success: false,
        message: "Cannot delete the order. It has already been processed.",
      });
    }

    await order.deleteOne();

    res.status(200).json({
      success: true,
      message: "Order deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong while deleting the order",
      error: error.message,
    });
  }
};


const updatePayment = async (req, res) => {
  const { orderId } = req.params;
  const { amount, paymentMode } = req.body;
  const salesmanId = req.user.salesmanId; // set by verifySalesmanToken middleware

  if (!amount || !paymentMode) {
    return res.status(422).json({
      success: false,
      message: "Amount and payment mode are required",
    });
  }

  try {
    // Get order
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Validate order belongs to that salesman
    if (order.placedBy.toString() !== salesmanId) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized to update this order payment",
      });
    }

    // Prevent overpayment
    if (amount > order.dueAmount) {
      return res.status(400).json({
        success: false,
        message: "Payment exceeds due amount",
      });
    }

    // Update payment info
    const newDueAmount = order.dueAmount - amount;
    order.dueAmount = newDueAmount;

    // Update status
    if (newDueAmount <= 0) {
      order.paymentStatus = "Paid";
      order.orderStatus = "Paid";
    } else {
      order.paymentStatus = "Partial";
    }

    order.paymentCollectedBy = salesmanId;

    await order.save();

    // Update salesman collection log
    await Salesman.findByIdAndUpdate(
      salesmanId,
      {
        $push: {
          collectedPayments: {
            order: order._id,
            amount,
            paymentMode,
            date: new Date()
          }
        }
      },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Payment updated successfully",
      data: {
        orderId: order._id,
        newDueAmount: order.dueAmount,
        paymentStatus: order.paymentStatus,
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};


// Get due orders
const getDueOrders = async (req, res) => {
  const salesmanId = req.user.salesmanId; // set by verifySalesmanToken middleware

  try {
    const dueOrders = await Order.find({
      placedBy: salesmanId,
      dueAmount: { $gt: 0 },
      orderStatus: { $ne: 'Paid' }
    }).populate('party', 'name contact');

    res.status(200).json({
      success: true,
      data: dueOrders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong while fetching due orders",
      error: error.message,
    });
  }
};


// Dashboard (sales, due, dispatch)
const getAllOrder = async (req, res) => {
  const salesmanId = req.user.salesmanId; // set by verifySalesmanToken middleware

  try {
    const orders = await Order.find({ placedBy: salesmanId })
      .populate('party', 'name contact')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong while fetching orders",
      error: error.message,
    });
  }
};


const getOrderDetails = async (req, res) => {
  const orderId = req.params.id;
  const salesmanId = req.user.salesmanId; // set by verifySalesmanToken middleware

  try {
    const order = await Order.findById(orderId)
      .populate('party', 'name contact')
      .populate('placedBy', 'name email');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Check if the logged-in salesman placed the order
    if (order.placedBy.toString() !== salesmanId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized. You can only view your own orders.",
      });
    }

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong while fetching order details",
      error: error.message,
    });
  }
}


module.exports = {
  deleteOrder,
  loginSalesman,
  getDueOrders,
  updatePayment,
  getAllOrder,
  getOrderDetails
};
