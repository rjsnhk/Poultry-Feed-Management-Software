import React, { useEffect, useState } from "react";
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { Controller, useForm } from "react-hook-form";
import { useProduct } from "../../hooks/useProduct";
import { CircularProgress } from "@mui/material";
import { formatRupee } from "../../utils/formatRupee";
import Box from "@mui/material/Box";
import OrdersForSalesman from "../../components/Salesman/OrderManagement/OrdersForSalesman";
import { useSalesmanOrder } from "../../hooks/useSalesmanOrder";

const SalesmanDashboardPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm();

  const { createOrder, isCreatingOrder } = useSalesmanOrder();

  const [openForm, setOpenForm] = useState(false);
  const { allProducts, isLoading } = useProduct();

  const onSubmit = (data) => {
    console.log(data);
    createOrder(data);
    setOpenForm(false);
  };

  if (isLoading)
    return (
      <div className="flex-1 flex items-center justify-center h-full w-full">
        <CircularProgress />
      </div>
    );

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="lg:text-3xl lg:font-bold mb-5">Dashboard</h1>
        <Button
          disableElevation
          variant="contained"
          size="small"
          startIcon={<AddIcon />}
          sx={{
            fontWeight: "600",
          }}
          onClick={() => setOpenForm(true)}
        >
          Place Order
        </Button>
      </div>
      <div>
        <OrdersForSalesman />
      </div>

      {/* Place Order Modal */}
      {openForm && (
        <div className="transition-all bg-black/30 backdrop-blur-sm w-full z-50 h-screen absolute top-0 left-0 flex items-center justify-center">
          <div className="bg-white p-7 rounded-lg w-[50%]">
            <p className="text-xl font-semibold mb-5">Place a new Order</p>
            <form
              className="grid grid-cols-2 gap-5"
              onSubmit={handleSubmit(onSubmit)}
            >
              <div>
                <div className="mb-5">
                  <h1 className="font-semibold text-gray-800 mb-3">
                    Party Information
                  </h1>
                  <div className="space-y-5">
                    <div>
                      <TextField
                        error={!!errors.party?.companyName}
                        size="small"
                        fullWidth
                        id="outlined-basic"
                        label="Company Name"
                        variant="outlined"
                        {...register("party.companyName", {
                          required: {
                            value: true,
                            message: "Company Name is required",
                          },
                        })}
                      />
                      {errors.party?.companyName && (
                        <p className="text-red-600 text-xs mt-1">
                          {errors.party.companyName.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <TextField
                        error={!!errors.party?.contactPersonNumber}
                        size="small"
                        fullWidth
                        id="outlined-basic"
                        label="Contact Person Number"
                        variant="outlined"
                        {...register("party.contactPersonNumber", {
                          required: {
                            value: true,
                            message: "Contact Person Number is required",
                          },
                        })}
                      />
                      {errors.party?.contactPersonNumber && (
                        <p className="text-red-600 text-xs mt-1">
                          {errors.party.contactPersonNumber.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <TextField
                        size="small"
                        error={!!errors.party?.address}
                        fullWidth
                        id="outlined-basic"
                        label="Address"
                        variant="outlined"
                        {...register("party.address", {
                          required: {
                            value: true,
                            message: "Address is required",
                          },
                        })}
                      />{" "}
                      {errors.party?.address && (
                        <p className="text-red-600 text-xs mt-1">
                          {errors.party.address.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <h1 className="font-semibold text-gray-800 mb-3">
                    Product Information
                  </h1>
                  <div className="space-y-5">
                    <FormControl
                      fullWidth
                      size="small"
                      error={!!errors.item}
                      className="mb-4"
                    >
                      <InputLabel id="item-label">Product</InputLabel>
                      <Controller
                        name="item"
                        control={control}
                        rules={{ required: "Product is required" }}
                        render={({ field }) => (
                          <Select
                            {...field}
                            labelId="item-label"
                            id="item"
                            label="Product"
                          >
                            <MenuItem>Select Product</MenuItem>
                            {allProducts?.map((product) => (
                              <MenuItem key={product._id} value={product._id}>
                                {product.name} ({formatRupee(product.price)}/kg)
                              </MenuItem>
                            ))}
                          </Select>
                        )}
                      />
                      {errors?.item && (
                        <span className="text-red-600 text-xs mt-1">
                          {errors.item.message}
                        </span>
                      )}
                    </FormControl>
                    <div>
                      <TextField
                        error={!!errors.quantity}
                        size="small"
                        fullWidth
                        type="number"
                        id="outlined-basic"
                        label="Quantity in kg"
                        variant="outlined"
                        {...register("quantity", {
                          required: {
                            value: true,
                            message: "Quantity is required",
                          },
                        })}
                      />
                      {errors.quantity && (
                        <p className="text-red-600 text-xs mt-1">
                          {errors.quantity.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <div>
                  <h1 className="font-semibold text-gray-800 mb-3">
                    Payment Information
                  </h1>
                  <div className="space-y-5">
                    <div>
                      <TextField
                        error={!!errors.advanceAmount}
                        size="small"
                        fullWidth
                        type="number"
                        id="outlined-basic"
                        label="Advance Amount"
                        variant="outlined"
                        {...register("advanceAmount", {
                          required: {
                            value: true,
                            message:
                              "Advance Amount is required, enter 0 if null",
                          },
                        })}
                      />
                      {errors.advanceAmount && (
                        <p className="text-red-600 text-xs mt-1">
                          {errors.advanceAmount.message}
                        </p>
                      )}
                    </div>
                    <Box sx={{ width: "100%" }}>
                      <TextField
                        error={!!errors.dueDate}
                        fullWidth
                        label="Due Date"
                        type="date"
                        size="small"
                        InputLabelProps={{
                          shrink: true,
                        }}
                        {...register("dueDate", {
                          required: {
                            value: true,
                            message: "Due Date is required",
                          },
                        })}
                      />
                      {errors.dueDate && (
                        <p className="text-red-600 text-xs mt-1">
                          {errors.dueDate.message}
                        </p>
                      )}
                    </Box>
                    <FormControl
                      fullWidth
                      size="small"
                      error={!!errors.paymentMode}
                      className="mb-4"
                    >
                      <InputLabel id="paymentMode-label">
                        Payment Mode
                      </InputLabel>
                      <Controller
                        name="paymentMode"
                        control={control}
                        rules={{ required: "Payment Mode is required" }}
                        render={({ field }) => (
                          <Select
                            {...field}
                            labelId="paymentMode-label"
                            id="paymentMode"
                            label="Payment Mode"
                          >
                            <MenuItem>Select Payment Mode</MenuItem>
                            <MenuItem value="UPI">UPI</MenuItem>
                            <MenuItem value="Cash">Cash</MenuItem>
                            <MenuItem value="Bank Transfer">
                              Bank Transfer
                            </MenuItem>
                          </Select>
                        )}
                      />
                      {errors.paymentMode && (
                        <p className="text-red-600 text-xs mt-1">
                          {errors.paymentMode.message}
                        </p>
                      )}
                    </FormControl>
                    <div>
                      <TextField
                        size="small"
                        error={!!errors.notes}
                        fullWidth
                        rows={2}
                        multiline
                        id="outlined-basic"
                        label="Notes"
                        variant="outlined"
                        {...register("notes", {
                          required: {
                            value: true,
                            message: "Notes is required",
                          },
                        })}
                      />
                      {errors.notes && (
                        <p className="text-red-600 text-xs mt-1">
                          {errors.notes.message}
                        </p>
                      )}
                    </div>
                  </div>

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
                      loading={isCreatingOrder}
                      variant="contained"
                      disableElevation
                      sx={{ textTransform: "none" }}
                      type="submit"
                    >
                      Place Order
                    </Button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalesmanDashboardPage;
