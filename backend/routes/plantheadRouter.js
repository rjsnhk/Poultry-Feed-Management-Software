const express = require('express');
const plantHeadRouter = express.Router();
const {
  loginPlantHead,
  getAllOrders,
  getOrderDetails,
  getAllProductsInWarehouse,
  updateProductStock,
  dispatchOrder,
  getDispatchedOrders
} = require('../controllers/Planthead');

const { verifyPlanthead } = require('../middleware/verifyPlanthead');
const { cancelOrder } = require('../controllers/Orders');

// Login
plantHeadRouter.post('/login', loginPlantHead);

// //get the orders which is assigned to this warehouse
plantHeadRouter.get('/orders/getAll', verifyPlanthead, getAllOrders);

//get order details
plantHeadRouter.get('/orders/:orderId', verifyPlanthead, getOrderDetails);


// Get all products in the warehouse
plantHeadRouter.get('/warehouse/products', verifyPlanthead, getAllProductsInWarehouse);
// Update stock for a product
plantHeadRouter.put('/warehouse/products/:productId', verifyPlanthead, updateProductStock);



// Dispatch order he add all transport info also 
plantHeadRouter.put('/dispatch/:orderId',verifyPlanthead, dispatchOrder);

//get all dispatched orders
plantHeadRouter.get('/dispatched-orders', verifyPlanthead, getDispatchedOrders);


plantHeadRouter.post('/cancel_order/:orderId', verifyPlanthead, cancelOrder); // Cancel order


module.exports = plantHeadRouter;
