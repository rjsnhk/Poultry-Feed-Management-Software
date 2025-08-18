import React, { useState } from "react";
import { Mail, Phone, Trash2, SquarePen, Eye } from "lucide-react";
import { Button, IconButton, TextField } from "@mui/material";
import useEmployees from "../../../hooks/useEmployees";
import { CircularProgress } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useForm } from "react-hook-form";
import Avatar from "../../Avatar";

const SalesAuthorizer = ({ item }) => {
  const { _id } = item;
  const { deleteSalesAuthorizer, isLoading, updateSalesAuthorizer } =
    useEmployees();
  const [openDelete, setOpenDelete] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    data.id = _id;
    updateSalesAuthorizer(data, {
      onSuccess: () => {
        setOpenEdit(false);
      },
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <CircularProgress />
      </div>
    );
  }
  return (
    <div
      className="bg-white p-5 rounded-lg shadow hover:shadow-md transition-all"
      key={item.id}
    >
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-3">
          <Avatar
            // src={item.photo}
            name={item.name}
            online={item.isActive}
            size={56}
          />
          <div>
            <p className="font-semibold">{item.name}</p>
            <p className="text-sm">Sales Authorizer</p>
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

      <div className="text-gray-700 text-sm border-b border-gray-100 py-3 my-3">
        <div className="flex items-center gap-3 mb-1">
          <Mail size={15} /> {item.email}
        </div>
        <div className="flex items-center gap-3">
          <Phone size={15} /> {item.phone}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className=" bg-green-100 rounded-lg p-2">
          <p className="text-green-600 font-semibold text-sm">Orders</p>
          <p className="font-semibold text-base text-green-900">
            {item.orders}
          </p>
        </div>
        <div className=" bg-blue-100 rounded-lg p-2">
          <p className="text-blue-600 font-semibold text-sm">Sales</p>
          <p className="font-semibold text-base text-blue-900">₹{item.sales}</p>
        </div>
      </div>

      {/* --- Delete Employee Modal --- */}
      {openDelete && (
        <div className="transition-all bg-black/30 backdrop-blur-sm w-full z-50 h-screen absolute top-0 left-0 flex items-center justify-center">
          <div className="bg-white p-7 rounded-lg w-[29rem]">
            <p className="text-lg font-semibold">
              Are you sure you want to delete {item.name}?
            </p>
            <p className="text-gray-500 text-sm">
              This action cannot be undone. {item.name}'s data will be
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
                variant="contained"
                disableElevation
                color="error"
                sx={{ textTransform: "none" }}
                onClick={() => deleteSalesAuthorizer(item._id)}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* --- View Employee Modal --- */}
      {openView && (
        <div className="transition-all bg-black/30 backdrop-blur-sm w-full z-50 h-screen absolute top-0 left-0 flex items-center justify-center">
          <div className="bg-white relative p-7 rounded-lg w-[40rem] grid">
            <div>
              <div className="flex items-center justify-between">
                <p className="text-xl font-semibold">Employee Details</p>
                <IconButton size="small" onClick={() => setOpenView(false)}>
                  <CloseIcon />
                </IconButton>
              </div>
              <div className="grid lg:grid-cols-2 gap-7">
                <div>
                  <div className="flex items-center gap-3 mt-5">
                    <Avatar sx={{ width: 60, height: 60 }} />
                    <div>
                      <p className="font-semibold text-lg">{item.name}</p>
                      <p className="text-sm text-gray-500">Sales Authorizer</p>
                    </div>
                  </div>
                  <div className="text-gray-700 text-sm py-3 my-3">
                    <div className="flex items-center gap-3 mb-1">
                      <Mail size={15} /> {item.email}
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone size={15} /> {item.phone}
                    </div>
                  </div>
                </div>
                <div>
                  <p className="text-lg font-semibold">Performance Metrics</p>
                  <div className="grid grid-cols-2 gap-2">
                    <div className=" bg-green-100 rounded-lg p-2">
                      <p className="text-green-600 font-semibold text-sm">
                        Orders
                      </p>
                      <p className="font-semibold text-base text-green-900">
                        {item.orders}
                      </p>
                    </div>
                    <div className=" bg-blue-100 rounded-lg p-2">
                      <p className="text-blue-600 font-semibold text-sm">
                        Sales
                      </p>
                      <p className="font-semibold text-base text-blue-900">
                        ₹{item.sales}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- Edit Employee Modal --- */}
      {openEdit && (
        <div className="transition-all bg-black/30 backdrop-blur-sm w-full z-50 h-screen absolute top-0 left-0 flex items-center justify-center">
          <div className="bg-white p-7 rounded-lg w-[29rem]">
            <p className="text-xl font-semibold mb-7">Edit Sales Authorizer</p>
            <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
              <TextField
                size="small"
                fullWidth
                id="outlined-basic"
                label="Name"
                variant="outlined"
                defaultValue={item.name}
                {...register("name", {
                  required: { value: true, message: "Name is required" },
                })}
              />
              <TextField
                size="small"
                fullWidth
                id="outlined-basic"
                label="Email"
                variant="outlined"
                defaultValue={item.email}
                {...register("email", {
                  required: { value: true, message: "Email is required" },
                })}
              />
              <TextField
                size="small"
                fullWidth
                id="outlined-basic"
                label="Password"
                variant="outlined"
                defaultValue={item.password}
                {...register("password", {
                  required: { value: true, message: "Password is required" },
                })}
              />
              <TextField
                size="small"
                fullWidth
                id="outlined-basic"
                label="Phone"
                variant="outlined"
                defaultValue={item.phone}
                {...register("phone", {
                  required: { value: true, message: "Phone is required" },
                })}
              />
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

export default SalesAuthorizer;
