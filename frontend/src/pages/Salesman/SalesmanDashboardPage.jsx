import React, { useEffect, useState } from "react";
import {
  Button,
  ButtonGroup,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { Controller, set, useForm } from "react-hook-form";
import { useProduct } from "../../hooks/useProduct";
import { CircularProgress } from "@mui/material";
import { formatRupee } from "../../utils/formatRupee";
import Box from "@mui/material/Box";
import AllOrdersForSalesman from "../../components/Salesman/OrderManagement/AllOrdersForSalesman";
import { useSalesmanOrder } from "../../hooks/useSalesmanOrder";
import DueOrdersForSalesman from "../../components/Salesman/OrderManagement/DueOrdersForSalesman";

const SalesmanDashboardPage = () => {
  const [price, setPrice] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [error, setError] = useState("");
  const [dueDateError, setDueDateError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    watch,
  } = useForm();

  const { allProducts, isLoading } = useProduct();

  const selectedProductId = watch("item");
  useEffect(() => {
    const selectedProduct = allProducts?.find(
      (product) => product._id === selectedProductId
    );
    setPrice(selectedProduct?.price);
  }, [selectedProductId]);

  const quantity = watch("quantity");
  useEffect(() => {
    const total = price * quantity;
    setTotalAmount(total);
  }, [quantity]);

  const advanceAmount = watch("advanceAmount");
  useEffect(() => {
    if (advanceAmount > totalAmount) {
      setError("Advance cannot be greater than total amount");
    } else {
      setError("");
    }
  }, [totalAmount, advanceAmount]);

  const dueDate = watch("dueDate");
  useEffect(() => {
    if (dueDate < new Date().toISOString().split("T")[0]) {
      setDueDateError("Due Date cannot be in past");
    } else {
      setDueDateError("");
    }
  }, [dueDate]);

  const { createOrder, isCreatingOrder } = useSalesmanOrder();

  const [openForm, setOpenForm] = useState(false);

  const orderTypes = ["All Orders", "Due Orders"];
  const [isActive, setIsActive] = useState("All Orders");

  const onSubmit = (data) => {
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
        <h1 className="lg:text-3xl lg:font-bold mb-5">{isActive}</h1>
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

      <div className="mb-5">
        <ButtonGroup aria-label="Medium-sized button group">
          {orderTypes.map((order) => (
            <Button
              key={order._id}
              disableElevation
              variant={isActive === order ? "contained" : "outlined"}
              sx={{
                textTransform: "none",
              }}
              onClick={() => setIsActive(order)}
            >
              {order}
            </Button>
          ))}
        </ButtonGroup>
      </div>

      <div>
        {isActive === "All Orders" && <AllOrdersForSalesman />}
        {isActive === "Due Orders" && <DueOrdersForSalesman />}
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
                        type="number"
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
                  <div className="flex items-start justify-between">
                    <h1 className="font-semibold text-gray-800 mb-3">
                      Product Information
                    </h1>
                    {!isNaN(totalAmount) && (
                      <span className="text-blue-600 text-sm font-semibold">
                        Total: {formatRupee(totalAmount)}
                      </span>
                    )}
                  </div>
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
                        error={!!errors.advanceAmount || error}
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
                      {error && (
                        <p className="text-red-600 text-xs mt-1">{error}</p>
                      )}
                    </div>
                    <Box sx={{ width: "100%" }}>
                      <TextField
                        error={!!errors.dueDate || dueDateError}
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
                      {dueDateError && (
                        <p className="text-red-600 text-xs mt-1">
                          {dueDateError}
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
                            {Number(watch("advanceAmount")) === 0 && (
                              <MenuItem value="Not Paid">Not Paid</MenuItem>
                            )}
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
