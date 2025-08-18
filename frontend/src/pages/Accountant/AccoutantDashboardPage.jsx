import React from "react";
import OrdersForAccountant from "../../components/Accountant/OrdersForAccountant";

const AccoutantDashboardPage = () => {
  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="lg:text-3xl lg:font-bold mb-5">Accountant</h1>
      </div>

      <div>
        <OrdersForAccountant />
      </div>
    </div>
  );
};

export default AccoutantDashboardPage;
