import React from "react";
import { LuUsers } from "react-icons/lu";

const TotalEmployees = ({ total }) => {
  return (
    <div className="bg-white rounded-lg p-5 flex items-center justify-between gap-5 shadow hover:shadow-md transition-all">
      <div className="flex flex-col">
        <p className="text-left lg:font-semibold text-gray-600">
          Total Employees
        </p>
        <p className="lg:text-3xl text-left lg:font-semibold">{total}</p>
      </div>
      <div className="p-3 bg-blue-100 rounded-full">
        <LuUsers className="text-4xl opacity-70 text-blue-600" />
      </div>
    </div>
  );
};

export default TotalEmployees;
