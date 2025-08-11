// BASE URL
export const BASE_URL = "http://localhost:5000";

export const API_PATHS = {
  AUTH: {
    LOGIN: (type) => `/api/${type}/login`,
    LOGOUT: (type) => `/api/${type}/logout`,
  },

  ADMIN: {
    REGISTER: "/api/admin/register",
    LOGIN: "/api/admin/login",

    SALESMAN: {
      ADD: "/api/admin/add_salesman",
      GET_ALL: "/api/admin/get_allSalesman",
      GET: (id) => `/api/admin/get_salesman/${id}`,
      UPDATE: (id) => `/api/admin/update_salesman/${id}`,
      DELETE: (id) => `/api/admin/delete_salesman/${id}`,
    },

    SALESMANAGER: {
      ADD: "/api/admin/add_salesmanager",
      GET_ALL: "/api/admin/get_allsalesmanager",
      GET: (id) => `/api/admin/get_salesmanager/${id}`,
      UPDATE: (id) => `/api/admin/update_salesmanager/${id}`,
      DELETE: (id) => `/api/admin/delete_salesmanager/${id}`,
    },

    SALESAUTHORIZER: {
      ADD: "/api/admin/add_salesauthorizer",
      GET_ALL: "/api/admin/get_allsalesauthorizer",
      GET: (id) => `/api/admin/get_salesauthorizer/${id}`,
      UPDATE: (id) => `/api/admin/update_salesauthorizer/${id}`,
      DELETE: (id) => `/api/admin/delete_salesauthorizer/${id}`,
    },

    PLANTHEAD: {
      ADD: "/api/admin/add_planthead",
      GET_ALL: "/api/admin/get_allplantheads",
      GET: (id) => `/api/admin/get_planthead/${id}`,
      UPDATE: (id) => `/api/admin/update_planthead/${id}`,
      DELETE: (id) => `/api/admin/delete_planthead/${id}`,
    },

    ACCOUNTANT: {
      ADD: "/api/admin/add_accountant",
      GET_ALL: "/api/admin/get_allaccountants",
      GET: (id) => `/api/admin/get_accountant/${id}`,
      UPDATE: (id) => `/api/admin/update_accountant/${id}`,
      DELETE: (id) => `/api/admin/delete_accountant/${id}`,
    },

    WAREHOUSE: {
      ADD: "/api/admin/add_warehouse",
      GET_ALL: "/api/admin/get_allwarehouse",
      GET: (id) => `/api/admin/get_warehouse/${id}`,
      UPDATE: (id) => `/api/admin/update_warehouse/${id}`,
      DELETE: (id) => `/api/admin/delete_warehouse/${id}`,
      APPROVE: "/api/admin/approve_warehouse",

      ADD_PRODUCT: (warehouseId) =>
        `/api/admin/warehouse/${warehouseId}/add_product`,
      GET_PRODUCTS: (warehouseId) => `/api/admin/${warehouseId}/products`,
      UPDATE_PRODUCT_PRICE: (warehouseId, productId) =>
        `/api/admin/${warehouseId}/products/${productId}`,
      DELETE_PRODUCT: (warehouseId, productId) =>
        `/api/admin/${warehouseId}/products/${productId}`,
    },

    ORDERS: {
      GET_TO_APPROVE: "/api/admin/get_orders_to_approve",
      GET_ALL: "/api/admin/get_allorder",
      GET: (id) => `/api/admin/get_order/${id}`,
      CANCEL: (id) => `/api/admin/cancel_order/${id}`,
    },
  },

  SALESMAN: {
    LOGIN: "/api/salesman/login",
    CREATE_ORDER: "/api/salesman/create_order",
    DELETE_ORDER: (orderId) => `/api/salesman/delete_order/${orderId}`,
    GET_ALL_ORDERS: "/api/salesman/get_allorder",
    GET_ORDER: (orderId) => `/api/salesman/orders/${orderId}`,
    GET_DUE_ORDERS: "/api/salesman/orders/due",
    PAY_ORDER: (orderId) => `/api/salesman/orders/pay/${orderId}`,
    CHANGE_ACTIVITY_STATUS: "/api/salesman/change-activity-status",
  },

  MANAGER: {
    LOGIN: "/api/manager/login",
    GET_ASSIGNED_ORDERS: "/api/manager/orders/getAll",
    GET_ORDER: (orderId) => `/api/manager/orders/${orderId}`,
    FORWARD_ORDER: (orderId) => `/api/manager/forward/${orderId}`,
    GET_FORWARDED_ORDERS: "/api/manager/orders/forwarded",
    CHANGE_ACTIVITY_STATUS: "/api/manager/change-activity-status",
  },

  AUTHORIZER: {
    LOGIN: "/api/authorizer/login",
    GET_ASSIGNED_ORDERS: "/api/authorizer/orders/getAll",
    GET_ORDER: (orderId) => `/api/authorizer/orders/${orderId}`,
    ASSIGN_WAREHOUSE: (orderId) =>
      `/api/authorizer/assign-warehouse/${orderId}`,
    GET_ASSIGNMENT_HISTORY: "/api/authorizer/get-assignment-history",
    CHECK_WAREHOUSE_STATUS: (orderId) =>
      `/api/authorizer/warehouse-status/${orderId}`,
    CHANGE_ACTIVITY_STATUS: "/api/authorizer/change-activity-status",
  },

  PLANT_HEAD: {
    LOGIN: "/api/planthead/login",
    GET_ALL_ORDERS: "/api/planthead/orders/getAll",
    GET_ORDER: (orderId) => `/api/planthead/orders/${orderId}`,
    GET_PRODUCTS: "/api/planthead/warehouse/products",
    UPDATE_PRODUCT_STOCK: (productId) =>
      `/api/planthead/warehouse/products/${productId}`,
    DISPATCH_ORDER: (orderId) => `/api/planthead/dispatch/${orderId}`,
    GET_DISPATCHED_ORDERS: "/api/planthead/dispatched-orders",
    CHANGE_ACTIVITY_STATUS: "/api/planthead/change-activity-status",
  },

  ACCOUNTANT: {
    LOGIN: "/api/accountant/login",
    GET_DISPATCHED_ORDERS: "/api/accountant/dispatched-orders",
    GENERATE_INVOICE: (orderId) =>
      `/api/accountant/generate-invoice/${orderId}`,
    GET_INVOICE: (orderId) => `/api/accountant/invoice/${orderId}`,
    CHANGE_ACTIVITY_STATUS: "/api/accountant/change-activity-status",
  },

  ME: {
    GET: "/api/me",
  },
};
