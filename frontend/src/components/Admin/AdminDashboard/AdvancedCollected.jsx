import React from "react";
import { GiCash } from "react-icons/gi";

const AdvancedCollected = () => {
  return (
    <div className="bg-white rounded-lg p-5 flex items-center justify-between gap-5 shadow hover:shadow-md transition-all">
      <div className="flex flex-col">
        <p className="text-left lg:font-semibold text-gray-600">
          Advance Collected
        </p>
        <p className="lg:text-3xl text-left lg:font-semibold">₹32,000</p>
        <p className="text-left lg:font-semibold text-sm text-green-600">
          +28% in this month
        </p>
      </div>
      <div className="p-3 bg-indigo-100 rounded-full">
        <GiCash className="text-4xl opacity-70 text-indigo-600" />
      </div>
    </div>
  );
};

export default AdvancedCollected;
