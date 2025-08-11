const express = require("express");
const authorizerRouter = express.Router();

const {
  verifySalesauthorizer,
} = require("../middleware/verifySalesauthorizer");

const {
  loginSalesAuthorizer,
  getForwardedOrders,
  getOrderDetails,
  assignWarehouse,
  getAssignmentHistory,
  checkWarehouseApproval,
  changeActivityStatus,
} = require("../controllers/SalesAuthorizer");
const { cancelOrder } = require("../controllers/Orders");

authorizerRouter.post("/login", loginSalesAuthorizer);

authorizerRouter.get(
  "/orders/getAll",
  verifySalesauthorizer,
  getForwardedOrders
); // View all assigned orders
authorizerRouter.get(
  "/orders/:orderId",
  verifySalesauthorizer,
  getOrderDetails
); // Single order detail
authorizerRouter.put(
  "/assign-warehouse/:orderId",
  verifySalesauthorizer,
  assignWarehouse
); // Assign warehouse

authorizerRouter.post(
  "/cancel_order/:orderId",
  verifySalesauthorizer,
  cancelOrder
);

authorizerRouter.get(
  "/get-assignment-history",
  verifySalesauthorizer,
  getAssignmentHistory
); // Get assignment history
authorizerRouter.get(
  "/warehouse-status/:orderId",
  verifySalesauthorizer,
  checkWarehouseApproval
); // Check warehouse approval status

authorizerRouter.put(
  "/change-activity-status",
  verifySalesauthorizer,
  changeActivityStatus
); // Change activity status

module.exports = authorizerRouter;
