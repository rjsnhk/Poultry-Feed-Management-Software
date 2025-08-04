import React from "react";
import { RiVerifiedBadgeFill } from "react-icons/ri";

const ApprovedWarehouses = ({ approved }) => {
  return (
    <div className="bg-white rounded-lg p-5 flex items-center justify-between gap-5 shadow hover:shadow-md transition-all">
      <div className="flex flex-col">
        <p className="text-left lg:font-semibold text-gray-600">Approved</p>
        <p className="lg:text-3xl text-left lg:font-semibold">
          {approved?.length}
        </p>
      </div>
      <div className="p-3 bg-green-100 rounded-full">
        <RiVerifiedBadgeFill className="text-4xl opacity-70 text-green-600" />
      </div>
    </div>
  );
};

export default ApprovedWarehouses;
