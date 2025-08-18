const express = require("express");
const adminRouter = express.Router();
const {
  registerAdmin,
  loginAdmin,
  addSalesman,
  getAllSalesman,
  getSalesman,
  updateSalesman,
  deleteSalesman,
  addSalesManager,
  getAllSalesManager,
  getSalesManager,
  updateSalesManager,
  deleteSalesManager,
  addSalesAuthorizer,
  getAllSalesAuthorizer,
  getSalesAuthorizer,
  updateSalesAuthorizer,
  deleteSalesAuthorizer,
  addWarehouse,
  getAllWarehouse,
  getWarehouse,
  updateWarehouse,
  deleteWarehouse,
  addProductToWarehouse,
  addPlantHead,
  getAllPlantHeads,
  getPlantHead,
  updatePlantHead,
  deletePlantHead,
  addAccountant,
  getAllAccountants,
  getAccountant,
  updateAccountant,
  deleteAccountant,
  getAllProductsFromWarehouse,
  addProduct,
  getAllProducts,
  updateProductsPrice,
  deleteProduct,
  deleteProductsFromWarehouse,
  getFilteredProducts,
} = require("../controllers/Admin");

const { verifyAdmin } = require("../middleware/verifyAdmin");
const {
  cancelOrder,
  getOrderDetails,
  getAllOrder,
  getOrdersToApprove,
  approveOrderToWarehouse,
} = require("../controllers/Orders");

//ok
adminRouter.post("/register", registerAdmin);
adminRouter.post("/login", loginAdmin);

//ok
adminRouter.post("/add_salesman", verifyAdmin, addSalesman);
adminRouter.get("/get_allSalesman", verifyAdmin, getAllSalesman);
adminRouter.get("/get_salesman/:id", verifyAdmin, getSalesman);
adminRouter.put("/update_salesman/:id", verifyAdmin, updateSalesman);
adminRouter.delete("/delete_salesman/:id", verifyAdmin, deleteSalesman);

//ok
adminRouter.post("/add_salesmanager", verifyAdmin, addSalesManager);
adminRouter.get("/get_allsalesmanager", verifyAdmin, getAllSalesManager);
adminRouter.get("/get_salesmanager/:id", verifyAdmin, getSalesManager);
adminRouter.put("/update_salesmanager/:id", verifyAdmin, updateSalesManager);
adminRouter.delete("/delete_salesmanager/:id", verifyAdmin, deleteSalesManager);

//ok
adminRouter.post("/add_salesauthorizer", verifyAdmin, addSalesAuthorizer);
adminRouter.get("/get_allsalesauthorizer", verifyAdmin, getAllSalesAuthorizer);
adminRouter.get("/get_salesauthorizer/:id", verifyAdmin, getSalesAuthorizer);
adminRouter.put(
  "/update_salesauthorizer/:id",
  verifyAdmin,
  updateSalesAuthorizer
);
adminRouter.delete(
  "/delete_salesauthorizer/:id",
  verifyAdmin,
  deleteSalesAuthorizer
);

//ok
// PLANT HEAD ROUTES
adminRouter.post("/add_planthead", verifyAdmin, addPlantHead);
adminRouter.get("/get_allplantheads", verifyAdmin, getAllPlantHeads);
adminRouter.get("/get_planthead/:id", verifyAdmin, getPlantHead);
adminRouter.put("/update_planthead/:id", verifyAdmin, updatePlantHead);
adminRouter.delete("/delete_planthead/:id", verifyAdmin, deletePlantHead);

//ok
// ACCOUNTANT ROUTES
adminRouter.post("/add_accountant", verifyAdmin, addAccountant);
adminRouter.get("/get_allaccountants", verifyAdmin, getAllAccountants);
adminRouter.get("/get_accountant/:id", verifyAdmin, getAccountant);
adminRouter.put("/update_accountant/:id", verifyAdmin, updateAccountant);
adminRouter.delete("/delete_accountant/:id", verifyAdmin, deleteAccountant);

adminRouter.post("/add_product", verifyAdmin, addProduct);
adminRouter.get("/get_allproducts", getAllProducts);
adminRouter.delete("/delete_product/:productId", verifyAdmin, deleteProduct);
adminRouter.put("/products/:productId", verifyAdmin, updateProductsPrice);

//ok
adminRouter.post("/add_warehouse", verifyAdmin, addWarehouse);
adminRouter.get("/get_allwarehouse", verifyAdmin, getAllWarehouse);
adminRouter.get("/get_warehouse/:warehouseId", verifyAdmin, getWarehouse);
adminRouter.patch(
  "/update_warehouse/:warehouseId",
  verifyAdmin,
  updateWarehouse
);
adminRouter.delete(
  "/delete_warehouse/:warehouseId",
  verifyAdmin,
  deleteWarehouse
);

adminRouter.post(
  "/warehouse/:warehouseId/add_product",
  verifyAdmin,
  addProductToWarehouse
);
adminRouter.get(
  "/:warehouseId/products",
  // verifyAdmin,
  getAllProductsFromWarehouse
);
adminRouter.delete(
  "/:warehouseId/products/:productId",
  verifyAdmin,
  deleteProductsFromWarehouse
);

//added this new route on 12-08-2025
adminRouter.get(
  "/get-filtered-products/:category",
  verifyAdmin,
  getFilteredProducts
);

adminRouter.get("/get_orders_to_approve", verifyAdmin, getOrdersToApprove);
adminRouter.post("/approve_warehouse", verifyAdmin, approveOrderToWarehouse);
adminRouter.get("/get_allorder", verifyAdmin, getAllOrder);
adminRouter.get("/get_order/:id", verifyAdmin, getOrderDetails);
adminRouter.post("/cancel_order/:id", verifyAdmin, cancelOrder);

module.exports = adminRouter;
