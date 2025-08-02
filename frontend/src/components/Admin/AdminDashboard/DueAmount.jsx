import React from "react";
import { IoMdTime } from "react-icons/io";

const DueAmount = () => {
  return (
    <div className="bg-white rounded-lg p-5 flex items-center justify-between gap-5 shadow hover:shadow-md transition-all">
      <div className="flex flex-col">
        <p className="text-left lg:font-semibold text-gray-600">Due Amount</p>
        <p className="lg:text-3xl text-left lg:font-semibold">₹2,000</p>
        <p className="text-left lg:font-semibold text-sm text-red-600">
          -20% in this month
        </p>
      </div>
      <div className="p-3 bg-red-100 rounded-full">
        <IoMdTime className="text-4xl opacity-70 text-red-600" />
      </div>
    </div>
  );
};

export default DueAmount;
