import React, { useState } from "react";
import TotalWarehouses from "../../components/Admin/WarehouseManagement/TotalWarehouses";
import ApprovedWarehouses from "../../components/Admin/WarehouseManagement/ApprovedWarehouses";
import PendingWarehouses from "../../components/Admin/WarehouseManagement/PendingWarehouses";
import StockItems from "../../components/Admin/WarehouseManagement/StockItems";
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import Warehouse from "../../components/Admin/WarehouseManagement/Warehouse";
import useWarehouse from "../../hooks/useWarehouse";
import { Controller, useForm } from "react-hook-form";
import useEmployees from "../../hooks/useEmployees";

const WarehouseManagementPage = () => {
  const { addWarehouse, warehouses, isLoading } = useWarehouse();
  const { planthead, accountant } = useEmployees();
  const [openForm, setOpenForm] = useState(false);

  const approvedWarehouses = warehouses?.filter(
    (warehouse) => warehouse.approved
  );

  const pendingWarehouses = warehouses?.filter(
    (warehouse) => !warehouse.approved
  );

  const stockItems = warehouses?.map((warehouse) => warehouse.stock?.length);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();

  const onAddingWarehouse = (data) => {
    addWarehouse(data);
    setOpenForm(false);
    console.log(data);
  };

  return (
    <div>
      <div className="lg:flex lg:justify-between lg:items-center mb-5">
        <h1 className="lg:text-3xl lg:font-bold">Warehouse Management</h1>
        <Button
          size="small"
          variant="contained"
          disableElevation
          sx={{
            fontWeight: "600",
          }}
          startIcon={<AddIcon />}
          onClick={() => setOpenForm(true)}
        >
          Add Warehouse
        </Button>
      </div>
      <div className="grid lg:grid-cols-4 gap-5">
        <TotalWarehouses total={warehouses?.length} />
        <ApprovedWarehouses approved={approvedWarehouses} />
        <PendingWarehouses pending={pendingWarehouses} />
        <StockItems stockItems={stockItems} />
      </div>
      <div className="mt-5 grid lg:grid-cols-3 gap-5">
        {warehouses?.map((warehouse) => (
          <Warehouse key={warehouse._id} warehouse={warehouse} />
        ))}
      </div>

      {/* Add Warehouse Modal */}
      {openForm && (
        <div className="transition-all bg-black/30 backdrop-blur-sm w-full z-50 h-screen absolute top-0 left-0 flex items-center justify-center">
          <div className="bg-white p-7 rounded-lg w-[29rem]">
            <p className="text-lg font-semibold mb-5">Add Warehouse</p>
            <form
              className="space-y-5"
              onSubmit={handleSubmit(onAddingWarehouse)}
            >
              <TextField
                size="small"
                fullWidth
                id="outlined-basic"
                label="Name"
                variant="outlined"
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
                  render={({ field }) => (
                    <Select
                      {...field}
                      labelId="acc-label"
                      id="acc"
                      label="Accountant"
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
                  onClick={() => setOpenForm(false)}
                >
                  Cancel
                </Button>
                <Button
                  loading={isLoading}
                  variant="contained"
                  disableElevation
                  sx={{ textTransform: "none" }}
                  type="submit"
                >
                  Add
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default WarehouseManagementPage;
