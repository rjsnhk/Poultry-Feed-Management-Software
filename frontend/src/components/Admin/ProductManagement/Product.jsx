import React from "react";
import { Eye, SquarePen, Trash2 } from "lucide-react";

const Product = () => {
  return (
    <div className="shadow bg-white lg:rounded-lg lg:p-4 lg:flex lg:flex-col lg:gap-5 hover:shadow-md transition-all">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <p className="text-left lg:text-lg lg:font-semibold">
            Chick Starter Feed
          </p>
          <p className="bg-indigo-50 text-indigo-500 text-sm rounded-full p-1 px-3">
            Starter Feed
          </p>
        </div>
        <div className="grid lg:grid-cols-2 lg:gap-2 text-sm">
          <p>Age group: 0-4 weeks</p>
          <p>Protein: 22%</p>
          <p>Price: ₹35/kg</p>
          <p>Weight: 5kg, 25kg, 50kg</p>
          <p>Form: Crumbled</p>
          <p>Stock: Available </p>
        </div>
      </div>
      <div className="flex items-center gap-1">
        <Eye
          color="blue"
          className="hover:bg-blue-100 active:scale-95 transition-all p-1.5 rounded-lg"
          size={30}
          onClick={() => setOpenView(true)}
        />
        <SquarePen
          color="green"
          className="hover:bg-green-100 active:scale-95 transition-all p-1.5 rounded-lg"
          size={30}
          onClick={() => setOpenEdit(true)}
        />
        <Trash2
          color="red"
          className="hover:bg-red-100 active:scale-95 transition-all p-1.5 rounded-lg"
          size={30}
          onClick={() => setOpenDelete(true)}
        />
      </div>
    </div>
  );
};

export default Product;
