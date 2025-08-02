import React from "react";
import { TbShoppingBag } from "react-icons/tb";

const TotalOrders = () => {
  return (
    <div className="bg-white rounded-lg p-5 flex items-center justify-between gap-5 shadow hover:shadow-md transition-all">
      <div className="flex flex-col">
        <p className="text-left lg:font-semibold text-gray-600">Total Orders</p>
        <p className="lg:text-3xl text-left lg:font-semibold">24</p>
        <p className="text-left lg:font-semibold text-sm text-green-600">
          +16% in this month
        </p>
      </div>
      <div className="p-3 bg-orange-100 rounded-full">
        <TbShoppingBag className="text-4xl opacity-70 text-orange-600" />
      </div>
    </div>
  );
};

export default TotalOrders;
