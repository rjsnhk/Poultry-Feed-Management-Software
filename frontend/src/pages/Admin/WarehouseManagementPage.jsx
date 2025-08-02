import React from "react";
import TotalWarehouses from "../../components/Admin/WarehouseManagement/TotalWarehouses";
import ApprovedWarehouses from "../../components/Admin/WarehouseManagement/ApprovedWarehouses";
import PendingWarehouses from "../../components/Admin/WarehouseManagement/PendingWarehouses";

const WarehouseManagementPage = () => {
  return (
    <div>
      <h1 className="lg:text-3xl lg:font-bold mb-5">Warehouse Management</h1>
      <div className="grid lg:grid-cols-4 gap-5">
        <TotalWarehouses />
        <ApprovedWarehouses />
        <PendingWarehouses />
      </div>
    </div>
  );
};

export default WarehouseManagementPage;
