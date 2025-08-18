import React from "react";
import OrdersForAuthorizer from "../../components/SalesAuthorizer/OrderManagementForSalesAuthorizer/OrdersForAuthorizer";

const SalesAuthorizerDashboardPage = () => {
  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="lg:text-3xl lg:font-bold mb-5">Dashboard</h1>
      </div>

      <div>
        <OrdersForAuthorizer />
      </div>
    </div>
  );
};

export default SalesAuthorizerDashboardPage;
