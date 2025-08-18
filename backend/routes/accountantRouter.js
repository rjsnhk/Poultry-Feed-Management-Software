const express = require("express");
const accountantRouter = express.Router();
const {
  loginAccountant,
  getDispatchedOrders,
  generateInvoice,
  getInvoiceDetails,
  changeActivityStatus,
  getOrderDetails,
} = require("../controllers/Accountant");
const { verifyAccountant } = require("../middleware/verifyAccountant");

// Login
accountantRouter.post("/login", loginAccountant);

// Protected Routes
accountantRouter.get(
  "/dispatched-orders",
  verifyAccountant,
  getDispatchedOrders
);

//Get Order Details
accountantRouter.get("/order/:orderId", verifyAccountant, getOrderDetails);

accountantRouter.post(
  "/generate-invoice/:orderId",
  verifyAccountant,
  generateInvoice
);
accountantRouter.get("/invoice/:orderId", verifyAccountant, getInvoiceDetails);

accountantRouter.put(
  "/change-activity-status",
  verifyAccountant,
  changeActivityStatus
);

module.exports = accountantRouter;
