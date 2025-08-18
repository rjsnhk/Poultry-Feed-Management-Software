import React from "react";
import OrdersForManager from "../../components/SalesManager/OrderManagementForSalesManager/OrdersForManager";

const SalesManagerDashboardPage = () => {
  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="lg:text-3xl lg:font-bold mb-5">Sales Manager</h1>
      </div>

      <div>
        <OrdersForManager />
      </div>
    </div>
  );
};

export default SalesManagerDashboardPage;
