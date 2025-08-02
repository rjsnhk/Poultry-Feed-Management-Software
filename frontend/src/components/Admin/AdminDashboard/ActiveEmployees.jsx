import React from "react";
import { FiUserCheck } from "react-icons/fi";

const ActiveEmployees = () => {
  return (
    <div className="bg-white rounded-lg p-5 flex items-center justify-between gap-5 shadow hover:shadow-md transition-all">
      <div className="flex flex-col">
        <p className="text-left lg:font-semibold text-gray-600">
          Active Employees
        </p>
        <p className="lg:text-3xl text-left lg:font-semibold">2</p>
        <p className="text-left lg:font-semibold text-sm text-green-600">
          +1 in this month
        </p>
      </div>
      <div className="p-3 bg-violet-100 rounded-full">
        <FiUserCheck className="text-4xl opacity-70 text-violet-600" />
      </div>
    </div>
  );
};

export default ActiveEmployees;
