const express = require('express');
const salesmanRouter = express.Router();
const {
  loginSalesman,
  getDueOrders,
  getAllOrder,
  updatePayment,
  getOrderDetails,
  deleteOrder
  
} = require('../controllers/Salesman');

const { verifySalesmanToken } = require('../middleware/verifySalesman');
const { createOrder } = require('../controllers/Orders');

// Login
salesmanRouter.post('/login', loginSalesman);

// Protected routes
salesmanRouter.post('/create_order', verifySalesmanToken, createOrde);
salesmanRouter.delete('/delete_order/:orderId', verifySalesmanToken, deleteOrder);
salesmanRouter.get('/get_allorder', verifySalesmanToken, getAllOrder);
salesmanRouter.get('/orders/:orderId', verifySalesmanToken, getOrderDetails);
salesmanRouter.get('/orders/due', verifySalesmanToken, getDueOrders);
salesmanRouter.post('/orders/pay/:orderId', verifySalesmanToken, updatePayment);

module.exports = salesmanRouter;
