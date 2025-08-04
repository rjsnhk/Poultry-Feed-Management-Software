import React, { useState } from "react";
import { SiDecentraland } from "react-icons/si";
import { IoLocationOutline } from "react-icons/io5";
import { Eye, Mail, Phone, SquarePen, Trash2 } from "lucide-react";
import CloseIcon from "@mui/icons-material/Close";
import useWarehouse from "../../../hooks/useWarehouse";
import {
  Avatar,
  Button,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import useEmployees from "../../../hooks/useEmployees";

const Warehouse = ({ warehouse }) => {
  const { updateWarehouse, deleteWarehouse, isLoading } = useWarehouse();
  const { planthead, accountant } = useEmployees();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();
  const [openEdit, setOpenEdit] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  const handleEditWarehouse = (data) => {
    data._id = warehouse._id;
    updateWarehouse(data);
    console.log(data);
    setOpenEdit(false);
  };

  return (
    <div className="bg-white rounded-lg p-5 shadow hover:shadow-md transition-all">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-pink-100 rounded-full">
            <SiDecentraland className="text-4xl opacity-70 text-pink-600" />
          </div>
          <div>
            <p className="font-semibold text-lg">{warehouse.name}</p>
            <div className="flex items-center gap-1">
              <IoLocationOutline className="text-gray-600" />
              <p className="text-sm text-gray-600">{warehouse.location}</p>
            </div>
          </div>
        </div>
        <div>
          <div>
            {warehouse.approved ? (
              <p className="bg-green-100 p-1 px-3 rounded-full text-green-800 text-sm">
                Approved
              </p>
            ) : (
              <p className="bg-gray-100 p-1 px-3 rounded-full text-gray-800 text-sm">
                Pending
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="mt-5 space-y-2">
        <div className="text-sm text-gray-600 flex justify-between">
          <span>Plant Head:</span>
          <span className="text-black">{warehouse?.plantHead?.name}</span>
        </div>
        <div className="text-sm text-gray-600 flex justify-between">
          <span>Accountant:</span>
          <span className="text-black">{warehouse?.accountant?.name}</span>
        </div>
        <div className="text-sm text-gray-600 flex justify-between">
          <span>Stock items:</span>
          <span className="text-black">{warehouse?.stock?.length}</span>
        </div>
      </div>

      <div className="flex items-center gap-1 mt-5">
        <button className="p-1 px-2 rounded-lg bg-violet-100 text-violet-800 w-full text-sm hover:bg-violet-200 active:scale-95 transition-all">
          Manage Stock
        </button>
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

      {/* --- Edit Employee Modal --- */}
      {openEdit && (
        <div className="transition-all bg-black/30 backdrop-blur-sm w-full z-50 h-screen absolute top-0 left-0 flex items-center justify-center">
          <div className="bg-white p-7 rounded-lg w-[29rem]">
            <p className="text-xl font-semibold mb-7">Edit Warehouse</p>
            <form
              className="space-y-5"
              onSubmit={handleSubmit(handleEditWarehouse)}
            >
              <TextField
                size="small"
                fullWidth
                id="outlined-basic"
                label="Name"
                variant="outlined"
                defaultValue={warehouse.name}
                {...register("name", {
                  required: { value: true, message: "Name is required" },
                })}
              />
              <TextField
                size="small"
                fullWidth
                id="outlined-basic"
                label="Location"
                variant="outlined"
                defaultValue={warehouse.location}
                {...register("location", {
                  required: { value: true, message: "Location is required" },
                })}
              />
              <FormControl
                fullWidth
                size="small"
                error={!!errors.plantHead}
                className="mb-4"
              >
                <InputLabel id="plantHead-label">Plant Head</InputLabel>
                <Controller
                  name="plantHead"
                  control={control}
                  rules={{ required: "Plant Head is required" }}
                  defaultValue={warehouse?.plantHead?._id}
                  render={({ field }) => (
                    <Select
                      {...field}
                      labelId="plantHead-label"
                      id="plantHead"
                      label="Plant Head"
                    >
                      <MenuItem>Select Plant Head</MenuItem>
                      {planthead?.map((head) => (
                        <MenuItem key={head._id} value={head._id}>
                          {head.name}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
                {errors?.planthead && (
                  <span className="text-red-500 text-sm mt-1">
                    {errors.planthead.message}
                  </span>
                )}
              </FormControl>
              <FormControl
                fullWidth
                size="small"
                error={!!errors.accountant}
                className="mb-4"
              >
                <InputLabel id="acc-label">Accountant</InputLabel>
                <Controller
                  name="accountant"
                  control={control}
                  rules={{ required: "Accountant is required" }}
                  defaultValue={warehouse?.accountant?._id}
                  render={({ field }) => (
                    <Select
                      {...field}
                      labelId="acc-label"
                      id="acc"
                      label="Accountant"
                      defaultValue={warehouse.accountant.name}
                    >
                      <MenuItem>Select Accountant</MenuItem>
                      {accountant?.map((acc) => (
                        <MenuItem key={acc._id} value={acc._id}>
                          {acc.name}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
                {errors?.accountant && (
                  <span className="text-red-500 text-sm mt-1">
                    {errors.accountant.message}
                  </span>
                )}
              </FormControl>

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

      {/* Delete Warehouse Modal */}
      {openDelete && (
        <div className="transition-all bg-black/30 backdrop-blur-sm w-full z-50 h-screen absolute top-0 left-0 flex items-center justify-center">
          <div className="bg-white p-7 rounded-lg w-[29rem]">
            <p className="text-lg font-semibold">
              Are you sure you want to delete {warehouse.name}?
            </p>
            <p className="text-gray-500 text-sm">
              This action cannot be undone. {warehouse.name}'s data will be
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
                onClick={() => deleteWarehouse(warehouse?._id)}
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
                <p className="text-xl font-semibold">Warehouse Details</p>
                <IconButton size="small" onClick={() => setOpenView(false)}>
                  <CloseIcon />
                </IconButton>
              </div>
              <div className="grid lg:grid-cols-2 gap-7 mt-5">
                <div>
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-pink-100 rounded-full">
                      <SiDecentraland className="text-4xl opacity-70 text-pink-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-lg">{warehouse.name}</p>
                      <div className="flex items-center gap-1">
                        <IoLocationOutline className="text-gray-600" />
                        <p className="text-sm text-gray-600">
                          {warehouse.location}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="text-gray-700 text-sm py-3 mt-3 p-3 rounded-lg border-2 border-gray-100">
                    <p className="font-semibold text-base">Plant Head</p>
                    <p>
                      Name:{" "}
                      <span className="font-semibold">
                        {warehouse.plantHead.name}
                      </span>
                    </p>
                    <p>
                      Email:{" "}
                      <span className="font-semibold">
                        {warehouse.plantHead.email}
                      </span>
                    </p>
                  </div>
                  <div className="text-gray-700 text-sm py-3 mb-3 mt-2 p-3 rounded-lg border-2 border-gray-100">
                    <p className="font-semibold text-base">Accountant</p>
                    <p>
                      Name:{" "}
                      <span className="font-semibold">
                        {warehouse.accountant.name}
                      </span>
                    </p>
                    <p>
                      Email:{" "}
                      <span className="font-semibold">
                        {warehouse.accountant.email}
                      </span>
                    </p>
                  </div>
                </div>
                <div>
                  <p className="font-semibold text-lg">Stock</p>
                  <div>
                    {warehouse.stock?.map((stock) => (
                      <p key={stock._id}>{stock.product.name}</p>
                    ))}
                  </div>
                  <div className="flex items-center gap-3">
                    <p>Product name</p>
                    <p>Quantity</p>
                    <p>Price</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Warehouse;
