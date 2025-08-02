import React from "react";
import { LiaWarehouseSolid } from "react-icons/lia";

const TotalWarehouses = () => {
  return (
    <div className="bg-white rounded-lg p-5 flex items-center justify-between gap-5 shadow hover:shadow-md transition-all">
      <div className="flex flex-col">
        <p className="text-left lg:font-semibold text-gray-600">
          Total Warehouses
        </p>
        <p className="lg:text-3xl text-left lg:font-semibold">3</p>
      </div>
      <div className="p-3 bg-violet-100 rounded-full">
        <LiaWarehouseSolid className="text-4xl opacity-70 text-violet-600" />
      </div>
    </div>
  );
};

export default TotalWarehouses;
