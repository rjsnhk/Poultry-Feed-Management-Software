import React from "react";
import { useUser } from "../../hooks/useUser";
import OrdersForPlantHead from "../../components/Planthead/OrdersForPlantHead";

const PlantheadDashboardPage = () => {
  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="lg:text-3xl lg:font-bold mb-5">Plant Head</h1>
      </div>

      <div>
        <OrdersForPlantHead />
      </div>
    </div>
  );
};

export default PlantheadDashboardPage;
