import React, { useState } from "react";
import { Eye, SquarePen, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { Button, TextField } from "@mui/material";
import { useForm } from "react-hook-form";
import { useProduct } from "../../../hooks/useProduct";

const Product = ({ product }) => {
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const { deleteProduct, updateProductPrice, isLoading } = useProduct();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onEdit = (data) => {
    data.productId = product._id;
    console.log(data);
    updateProductPrice(data);
    setOpenEdit(false);
  };

  return (
    <div className="shadow bg-white lg:rounded-lg lg:p-4 lg:flex lg:flex-col justify-between hover:shadow-md transition-all">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <p className="text-left lg:text-lg lg:font-bold">{product.name}</p>
          <p className="bg-indigo-50 text-indigo-500 text-sm rounded-full p-1 px-3">
            {product.category}
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-sm">
            <span className="font-semibold">Description:</span>{" "}
            {product.description}
          </p>
          <p className="text-green-700 text-sm font-semibold">
            <span className="font-semibold">Price:</span> ₹{product.price}
          </p>
        </div>
      </div>
      <div className="flex items-center justify-between mt-2">
        <p className="text-xs text-gray-500">
          {format(product.createdAt, "dd/MM/yyyy")}
        </p>
        <div className="flex items-center gap-1">
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

      {/* --- Delete Product Modal --- */}
      {openDelete && (
        <div className="transition-all bg-black/30 backdrop-blur-sm w-full z-50 h-screen absolute top-0 left-0 flex items-center justify-center">
          <div className="bg-white p-7 rounded-lg w-[29rem]">
            <p className="text-lg font-semibold">
              Are you sure you want to delete {product.name}?
            </p>
            <p className="text-gray-500 text-sm">
              This action cannot be undone. {product.name}'s data will be
              permanently removed.
            </p>
            <div className="flex items-center justify-end gap-3 mt-5">
              <Button
                variant="outlined"
                disableElevation
                color="error"
                sx={{ textTransform: "none" }}
                onClick={() => setOpenDelete(false)}
              >
                Cancel
              </Button>
              <Button
                loading={isLoading}
                loadingPosition="start"
                variant="contained"
                disableElevation
                color="error"
                sx={{ textTransform: "none" }}
                onClick={() => deleteProduct(product._id)}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* --- Edit Product Modal --- */}
      {openEdit && (
        <div className="transition-all bg-black/30 backdrop-blur-sm w-full z-50 h-screen absolute top-0 left-0 flex items-center justify-center">
          <div className="bg-white p-7 rounded-lg w-[29rem]">
            <p className="text-xl font-semibold mb-7">Edit {product.name}</p>
            <form className="space-y-5" onSubmit={handleSubmit(onEdit)}>
              <TextField
                size="small"
                fullWidth
                id="outlined-basic"
                label=" Category"
                variant="outlined"
                disabled
                defaultValue={product.category}
              />
              <TextField
                size="small"
                fullWidth
                id="outlined-basic"
                label="Product Name"
                variant="outlined"
                disabled
                defaultValue={product.name}
              />
              <TextField
                size="small"
                fullWidth
                id="outlined-basic"
                label="Description"
                variant="outlined"
                disabled
                defaultValue={product.description}
              />
              <TextField
                error={!!errors.price}
                size="small"
                fullWidth
                id="outlined-basic"
                label="Price per bag"
                variant="outlined"
                defaultValue={product.price}
                {...register("price", {
                  required: { value: true, message: "Price is required" },
                })}
              />
              {errors.price && (
                <span className="text-red-500 text-xs mt-1">
                  {errors.price.message}
                </span>
              )}
              <div className="flex items-center justify-end gap-3 mt-5">
                <Button
                  variant="outlined"
                  disableElevation
                  sx={{ textTransform: "none" }}
                  onClick={() => setOpenEdit(false)}
                >
                  Cancel
                </Button>
                <Button
                  loading={isLoading}
                  loadingPosition="start"
                  variant="contained"
                  disableElevation
                  sx={{ textTransform: "none" }}
                  type="submit"
                >
                  Save
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Product;
