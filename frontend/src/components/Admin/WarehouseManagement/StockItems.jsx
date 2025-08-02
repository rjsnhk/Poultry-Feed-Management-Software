import React from "react";

const StockItems = () => {
  return (
    <div className="bg-white rounded-lg p-5 flex items-center justify-between gap-5 shadow hover:shadow-md transition-all">
      <div className="flex flex-col">
        <p className="text-left lg:font-semibold text-gray-600">Pending</p>
        <p className="lg:text-3xl text-left lg:font-semibold">1</p>
      </div>
      <div className="p-3 bg-red-100 rounded-full">
        <MdOutlineAccessTime className="text-4xl opacity-70 text-red-600" />
      </div>
    </div>
  );
};

export default StockItems;
