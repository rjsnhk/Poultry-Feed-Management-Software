import React from "react";
import { formatRupee } from "../../../utils/formatRupee.js";

const RejectedPartiesForAdmin = ({ party }) => {
  const pendingDue = 1000000 - party.balance;
  return (
    <div className="shadow bg-white lg:rounded-lg lg:p-4 lg:flex lg:flex-col justify-between hover:shadow-md transition-all">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <p className="text-left lg:text-lg lg:font-bold">
            {party.companyName}
          </p>
          {party?.partyStatus === "rejected" && (
            <p className="p-1 px-3 text-xs text-red-700 font-semibold bg-red-100 rounded-full">
              Rejected
            </p>
          )}
        </div>
        <div className="flex flex-col gap-5 mt-2">
          <div className="flex flex-col gap-2 text-sm">
            <div className="flex items-center justify-between font-semibold">
              <span className="text-gray-600 font-normal text-right">
                Address:
              </span>
              <span className="text-right">{party?.address}</span>
            </div>
            <div className="flex items-center justify-between font-semibold">
              <span className="text-gray-600 font-normal text-right">
                Contact Person Number:
              </span>
              {party?.contactPersonNumber}
            </div>
            <div className="flex items-center justify-between font-semibold">
              <span className="text-gray-600 font-normal text-right">
                Limit:
              </span>
              {formatRupee(party?.limit)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RejectedPartiesForAdmin;
