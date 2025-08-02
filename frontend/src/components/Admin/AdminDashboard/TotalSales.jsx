import React from "react";
import { CgDollar } from "react-icons/cg";

const TotalSales = () => {
  return (
    <div className="bg-white rounded-lg p-5 flex items-center justify-between gap-5 shadow hover:shadow-md transition-all">
      <div className="flex flex-col">
        <p className="text-left lg:font-semibold text-gray-600">Total Sales</p>
        <p className="lg:text-3xl text-left lg:font-semibold">₹10,000</p>
        <p className="text-left lg:font-semibold text-sm text-green-600">
          +12% in this month
        </p>
      </div>
      <div className="p-3 bg-green-100 rounded-full">
        <CgDollar className="text-4xl opacity-70 text-green-600" />
      </div>
    </div>
  );
};

export default TotalSales;
