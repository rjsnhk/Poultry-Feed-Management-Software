import { useState } from "react";
import {
  Button,
  CircularProgress,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Tooltip,
} from "@mui/material";
import { Eye, File, Trash2 } from "lucide-react";
import { TbFileInvoice } from "react-icons/tb";
import { format } from "date-fns";
import { DataGrid } from "@mui/x-data-grid";
import CloseIcon from "@mui/icons-material/Close";
import { formatRupee } from "../../../utils/formatRupee.js";
import { useSalesmanOrder } from "../../../hooks/useSalesmanOrder.js";
import { CgCreditCard } from "react-icons/cg";
import { Controller, useForm } from "react-hook-form";
import { MdOutlineCancel } from "react-icons/md";

const DueOrdersForSalesman = () => {
  const [singleOrderId, setSingleOrderId] = useState(null);
  const [openView, setOpenView] = useState(false);
  const [openInvoice, setOpenInvoice] = useState(false);
  const [openCancel, setOpenCancel] = useState(false);
  const [openUpdatePayment, setOpenUpdatePayment] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    watch,
  } = useForm();

  const reason = watch("reason");

  const {
    singleOrderFromSalesman,
    singleOrderLoading,
    dueOrdersInSalesman,
    dueOrdersInSalesmanLoading,
    cancelOrder,
    updatePayment,
    isUpdatingPayment,
    isCancelingOrder,
  } = useSalesmanOrder(singleOrderId);

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 5,
  });

  const handleView = (id) => {
    setSingleOrderId(id);
    setOpenView(true);
  };

  const handleOpenInvoice = (id) => {
    setSingleOrderId(id);
    setOpenInvoice(true);
  };

  const handleCancelOrder = (data) => {
    data.orderId = singleOrderId;
    console.log(data);
    cancelOrder(data);
    setOpenCancel(false);
  };

  const handleUpdatePayment = (data) => {
    data.orderId = singleOrderId;
    console.log(data);
    updatePayment(data);
    setOpenUpdatePayment(false);
    setValue("amount", "");
    setValue("paymentMode", "");
  };

  const columns = [
    {
      field: "orderId",
      headerName: "Order ID",
      flex: 1,
      minWidth: 80,
      maxWidth: 100,
    },
    { field: "product", headerName: "Product", flex: 1 },
    { field: "party", headerName: "Party", flex: 1 },
    { field: "date", headerName: "Date", flex: 1 },
    { field: "quantity", headerName: "Quantity", flex: 1 },
    {
      field: "totalAmount",
      headerName: "Total Amount",
      flex: 1,
    },
    {
      field: "advanceAmount",
      headerName: "Advance Amount",
      flex: 1,

      renderCell: (params) => (
        <span className={`${params.value !== "₹0" && "text-green-700"}`}>
          {params.value}
        </span>
      ),
    },
    {
      field: "dueAmount",
      headerName: "Due Amount",
      flex: 1,

      renderCell: (params) => (
        <span className={`${params.value !== "₹0" && "text-red-600"}`}>
          {params.value}
        </span>
      ),
    },
    {
      field: "orderStatus",
      headerName: "Status",
      flex: 1,
      renderCell: (params) => (
        <span
          className={`${
            params.value === "Cancelled"
              ? "text-red-800 bg-red-100 p-1 px-3 rounded-full"
              : params.value === "Delivered"
              ? "text-green-800 bg-green-100 p-1 px-3 rounded-full"
              : "text-gray-800 bg-gray-200 p-1 px-3 rounded-full"
          }`}
        >
          {params.value}
        </span>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      minWidth: 150,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <div className="flex items-center h-full gap-1">
          <Eye
            color="blue"
            className="hover:bg-blue-200 active:scale-95 transition-all p-1.5 rounded-lg"
            size={30}
            onClick={() => handleView(params.row.id)}
          />
          {params.row.paymentStatus !== "Paid" &&
            params.row.orderStatus !== "Delivered" && (
              <CgCreditCard
                color="purple"
                className="hover:bg-purple-200 active:scale-95 transition-all p-1.5 rounded-lg"
                size={30}
                onClick={() => {
                  setSingleOrderId(params.row.id);
                  setOpenUpdatePayment(true);
                }}
              />
            )}
          {params.row.invoiceGenerated && (
            <File
              strokeWidth={2.1}
              color="green"
              className="hover:bg-green-200 active:scale-95 transition-all p-1.5 rounded-lg"
              size={30}
              onClick={() => handleOpenInvoice(params.row.id)}
            />
          )}
          {params.row.orderStatus == "Placed" && (
            <Tooltip title="Cancel Order" placement="top">
              <MdOutlineCancel
                color="red"
                className="hover:bg-red-100 active:scale-95 transition-all p-1.5 rounded-lg"
                size={30}
                onClick={() => {
                  setSingleOrderId(params.row.id);
                  setOpenCancel(true);
                }}
              />
            </Tooltip>
          )}
        </div>
      ),
    },
  ];

  const rows = dueOrdersInSalesman?.map((order) => ({
    id: order._id,
    orderId: `#${order.orderId}`,
    party: order?.party?.companyName,
    date: format(order?.createdAt, "dd MMM yyyy"),
    product: order?.items?.map((p) => p.product?.name).join(", "),
    quantity: order?.items?.map((p) => `${p.quantity} bags`).join(", "),
    totalAmount: formatRupee(order.totalAmount),
    advanceAmount: formatRupee(order.advanceAmount),
    dueAmount: formatRupee(order.dueAmount),
    orderStatus: order.orderStatus,
    invoiceGenerated: order.invoiceGenerated,
  }));

  if (
    dueOrdersInSalesmanLoading ||
    isCancelingOrder ||
    isUpdatingPayment ||
    singleOrderLoading
  )
    return (
      <div className="flex items-center justify-center h-full w-full">
        <CircularProgress />
      </div>
    );

  return (
    <div className="transition-all rounded-lg mt-5 max-w-full">
      <DataGrid
        rows={rows}
        columns={columns}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        pageSizeOptions={[5, 10, 20, 50, 100]}
        pagination
        autoHeight
        sx={{
          width: "100%",
          borderRadius: "8px",
          minWidth: "100%",
          "& .MuiDataGrid-cell:focus": {
            outline: "none",
            backgroundColor: "none !important",
          },
          "& .MuiDataGrid-cell:focus-within": {
            outline: "none",
            backgroundColor: "none !important",
          },
          "& .MuiDataGrid-columnHeaders": {
            position: "sticky",
            top: 0,
            backgroundColor: "#fff",
            zIndex: 1,
          },
          "& .MuiDataGrid-virtualScroller": {
            overflowX: "auto !important",
            overflowY: "auto",
          },
          "& .MuiDataGrid-main": {
            maxWidth: "100%",
          },
        }}
        disableColumnResize={false}
      />

      {/* --- View Order Modal --- */}
      {openView && (
        <div className="transition-all bg-black/30 backdrop-blur-sm w-full z-50 h-screen absolute top-0 left-0 flex items-center justify-center">
          <div className="bg-white relative p-7 rounded-lg w-[50%] overflow-auto">
            <div className="mb-5">
              <div className="flex items-center justify-between">
                <p className="text-xl font-bold">Order Details</p>
                <IconButton size="small" onClick={() => setOpenView(false)}>
                  <CloseIcon />
                </IconButton>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-7">
              <div className="flex flex-col gap-5">
                <div className="flex flex-col gap-2 text-sm">
                  <h1 className="font-semibold text-base text-gray-800">
                    Order Information
                  </h1>
                  <div className="flex items-center justify-between font-semibold">
                    <span className="text-gray-600 font-normal">
                      Product Category:
                    </span>
                    {singleOrderFromSalesman?.item?.category}
                  </div>
                  <div className="flex items-center justify-between font-semibold">
                    <span className="text-gray-600 font-normal">
                      Product Name:
                    </span>
                    {singleOrderFromSalesman?.item?.name}
                  </div>
                  <div className="flex items-center justify-between font-semibold">
                    <span className="text-gray-600 font-normal">Quantity:</span>
                    {singleOrderFromSalesman?.quantity} kg
                  </div>
                  <div className="flex items-center justify-between font-semibold">
                    <span className="text-gray-600 font-normal">
                      Placed By:
                    </span>
                    {singleOrderFromSalesman?.placedBy?.name}
                  </div>
                  <div className="flex items-center justify-between font-semibold">
                    <span className="text-gray-600 font-normal">
                      Placed Date:
                    </span>
                    {(singleOrderFromSalesman?.createdAt, "dd MMM yyyy")}
                  </div>
                </div>
                <div className="flex flex-col gap-2 text-sm">
                  <h1 className="font-semibold text-base text-gray-800">
                    Payment Information
                  </h1>
                  <div className="flex items-center justify-between font-semibold">
                    <span className="text-gray-600 font-normal">
                      Total Amount:
                    </span>
                    {formatRupee(singleOrderFromSalesman?.totalAmount)}
                  </div>
                  <div className="flex items-center justify-between font-semibold text-green-700">
                    <span className="text-gray-600 font-normal">
                      Advance Amount:
                    </span>
                    {formatRupee(singleOrderFromSalesman?.advanceAmount)}
                  </div>
                  <div className="flex items-center justify-between font-semibold text-red-700">
                    <span className="text-gray-600 font-normal">
                      Due Amount:
                    </span>
                    {formatRupee(singleOrderFromSalesman?.dueAmount)}
                  </div>
                  <div className="flex items-center justify-between font-semibold">
                    <span className="text-gray-600 font-normal">
                      Payment Mode:
                    </span>
                    {singleOrderFromSalesman?.paymentMode}
                  </div>
                  {singleOrderFromSalesman?.dueAmount !== 0 && (
                    <div className="flex items-center justify-between font-semibold">
                      <span className="text-gray-600 font-normal">
                        Due Date:
                      </span>
                      {format(singleOrderFromSalesman?.dueDate, "dd MMM yyyy")}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-5">
                <div className="flex flex-col gap-2 text-sm">
                  <h1 className="font-semibold text-base text-gray-800">
                    Order Status
                  </h1>
                  <div className="flex items-center justify-between font-semibold">
                    <span className="text-gray-600 font-normal">
                      Order Status:
                    </span>
                    {singleOrderFromSalesman?.orderStatus === "Delivered" ? (
                      <span className="text-green-700 bg-green-100 p-1 px-3 rounded-full text-xs">
                        {singleOrderFromSalesman?.orderStatus}
                      </span>
                    ) : (
                      <span className="text-gray-700 bg-gray-200 p-1 px-3 rounded-full text-xs">
                        {singleOrderFromSalesman?.orderStatus}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between font-semibold">
                    <span className="text-gray-600 font-normal">
                      Payment Status:
                    </span>
                    {singleOrderFromSalesman?.paymentStatus === "Partial" && (
                      <span className="text-yellow-700 bg-yellow-100 p-1 px-3 rounded-full text-xs">
                        {singleOrderFromSalesman?.paymentStatus}
                      </span>
                    )}
                    {singleOrderFromSalesman?.paymentStatus === "Paid" && (
                      <span className="text-green-700 bg-green-100 p-1 px-3 rounded-full text-xs">
                        {singleOrderFromSalesman?.paymentStatus}
                      </span>
                    )}
                    {singleOrderFromSalesman?.paymentStatus === "Unpaid" && (
                      <span className="text-red-700 bg-red-100 p-1 px-3 rounded-full text-xs">
                        {singleOrderFromSalesman?.paymentStatus}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between font-semibold">
                    <span className="text-gray-600 font-normal">
                      Invoice Generated:
                    </span>
                    {singleOrderFromSalesman?.invoiceGenerated ? (
                      <span className="text-green-800 bg-green-100 p-1 px-3 rounded-full text-xs">
                        Yes
                      </span>
                    ) : (
                      <span className="text-red-700 bg-red-100 p-1 px-3 rounded-full text-xs">
                        No
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-2 text-sm">
                  <h1 className="font-semibold text-base text-gray-800">
                    Notes
                  </h1>
                  <p className="bg-green-50 rounded-lg p-3">
                    {singleOrderFromSalesman?.notes}
                  </p>
                </div>

                <div className="flex flex-col gap-2 text-sm">
                  <h1 className="font-semibold text-base text-gray-800">
                    Order Timeline
                  </h1>
                  <div className="flex items-center justify-between font-semibold">
                    <span className="text-gray-600 font-normal">
                      Order Placed On:
                    </span>{" "}
                    {format(singleOrderFromSalesman?.createdAt, "dd MMM yyyy")}
                  </div>
                </div>
                <div className="flex flex-col gap-2 text-sm">
                  <h1 className="font-semibold text-base text-gray-800">
                    Assigned Warehouse
                  </h1>
                  <div className="flex items-center justify-between font-semibold">
                    <span className="text-gray-600 font-normal">
                      Warehouse:
                    </span>
                    {singleOrderFromSalesman?.assignedWarehouse ? (
                      <div className="flex flex-col items-center">
                        {singleOrderFromSalesman?.assignedWarehouse?.name}
                        <span className="text-xs font-normal text-gray-600">
                          (
                          {singleOrderFromSalesman?.assignedWarehouse?.location}
                          )
                        </span>
                      </div>
                    ) : (
                      <span className="text-red-700 bg-red-100 p-1 px-3 rounded-full text-xs">
                        Not Assigned
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
            {singleOrderFromSalesman?.dispatchInfo && (
              <div className="flex flex-col gap-2 text-sm bg-green-50 p-3 rounded-lg mt-5">
                <h1 className="font-semibold text-base text-gray-800">
                  Dispatch Info
                </h1>
                <div className="grid grid-cols-2 gap-5">
                  <div className="flex flex-col gap-2 text-sm">
                    <div className="flex items-center justify-between font-semibold">
                      <span className="text-gray-600 font-normal">
                        Driver Name
                      </span>
                      {singleOrderFromSalesman?.dispatchInfo?.driverName}
                    </div>
                    <div className="flex items-center justify-between font-semibold">
                      <span className="text-gray-600 font-normal">
                        Driver Contact
                      </span>
                      {singleOrderFromSalesman?.dispatchInfo?.driverContact}
                    </div>
                    <div className="flex items-center justify-between font-semibold">
                      <span className="text-gray-600 font-normal">
                        Transport Company:
                      </span>{" "}
                      {singleOrderFromSalesman?.dispatchInfo?.transportCompany}
                    </div>
                    <div className="flex items-center justify-between font-semibold">
                      <span className="text-gray-600 font-normal">
                        Vehicle Number:
                      </span>{" "}
                      {singleOrderFromSalesman?.dispatchInfo?.vehicleNumber}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 text-sm">
                    <div className="flex items-center justify-between font-semibold">
                      <span className="text-gray-600 font-normal">
                        Dispatched By:
                      </span>{" "}
                      {
                        singleOrderFromSalesman?.dispatchInfo?.dispatchedBy
                          ?.name
                      }
                    </div>
                    <div className="flex items-center justify-between font-semibold">
                      <span className="text-gray-600 font-normal">
                        Plant Head Contact:
                      </span>{" "}
                      {
                        singleOrderFromSalesman?.dispatchInfo?.dispatchedBy
                          ?.phone
                      }
                    </div>
                    <div className="flex items-center justify-between font-semibold">
                      <span className="text-gray-600 font-normal">
                        Dispatched Date:
                      </span>
                      {format(
                        singleOrderFromSalesman?.dispatchInfo?.dispatchDate,
                        "dd MMM yyyy"
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- View Invoice Modal --- */}
      {openInvoice && (
        <div className="transition-all bg-black/30 backdrop-blur-sm w-full z-50 h-screen absolute top-0 left-0 flex items-center justify-center">
          <div className="bg-white relative p-7 w-[35%] rounded-lg overflow-auto">
            <div className="mb-5">
              <div className="flex items-center justify-between">
                <p className="text-xl font-bold">Invoice</p>
                <IconButton size="small" onClick={() => setOpenInvoice(false)}>
                  <CloseIcon />
                </IconButton>
              </div>
            </div>
            <div>
              <div className="flex flex-col gap-2 text-sm">
                <h1 className="font-semibold text-base text-gray-800">
                  Invoice By
                </h1>
                <div className="flex items-center justify-between font-semibold">
                  <span className="text-gray-600 font-normal">Name:</span>
                  {singleOrderFromSalesman?.invoiceDetails?.invoicedBy?.name}
                </div>
                <div className="flex items-center justify-between font-semibold">
                  <span className="text-gray-600 font-normal">Email:</span>
                  {singleOrderFromSalesman?.invoiceDetails?.invoicedBy?.email}
                </div>
              </div>

              <div className="flex flex-col gap-2 text-sm mt-5">
                <h1 className="font-semibold text-base text-gray-800">
                  Party Details
                </h1>
                <div className="flex items-center justify-between font-semibold">
                  <span className="text-gray-600 font-normal">
                    Company Name:
                  </span>
                  {singleOrderFromSalesman?.party?.companyName}
                </div>
                <div className="flex items-center justify-between font-semibold">
                  <span className="text-gray-600 font-normal">Address:</span>
                  {singleOrderFromSalesman?.party?.address}
                </div>
                <div className="flex items-center justify-between font-semibold">
                  <span className="text-gray-600 font-normal">
                    Contact Person Number:
                  </span>
                  {singleOrderFromSalesman?.party?.contactPersonNumber}
                </div>
              </div>

              <div className="flex flex-col gap-2 text-sm mt-5">
                <h1 className="font-semibold text-base text-gray-800">
                  Payment Information
                </h1>
                <div className="flex items-center justify-between font-semibold">
                  <span className="text-gray-600 font-normal">
                    Total Amount:
                  </span>
                  {formatRupee(
                    singleOrderFromSalesman?.invoiceDetails?.totalAmount
                  )}
                </div>
                <div className="flex items-center justify-between font-semibold text-green-700">
                  <span className="text-gray-600 font-normal">
                    Advance Amount:
                  </span>
                  {formatRupee(
                    singleOrderFromSalesman?.invoiceDetails?.advanceAmount
                  )}
                </div>
                <div className="flex items-center justify-between font-semibold text-red-700">
                  <span className="text-gray-600 font-normal">Due Amount:</span>
                  {formatRupee(
                    singleOrderFromSalesman?.invoiceDetails?.dueAmount
                  )}
                </div>
                <div className="flex items-center justify-between font-semibold">
                  <span className="text-gray-600 font-normal">Due Date:</span>
                  {format(
                    singleOrderFromSalesman?.invoiceDetails?.dueDate,
                    "dd MMM yyyy"
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Order Modal */}
      {/* {openDelete && (
        <div className="transition-all bg-black/30 backdrop-blur-sm w-full z-50 h-screen absolute top-0 left-0 flex items-center justify-center">
          <div className="bg-white p-7 rounded-lg w-[29rem]">
            <p className="text-lg font-semibold">
              Are you sure you want to delete "
              {singleOrderFromSalesman?.item?.name}"?
            </p>
            <p className="text-gray-500 text-sm">
              This action cannot be undone.{" "}
              {singleOrderFromSalesman?.item?.name}'s data will be permanently
              removed.
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
                onClick={handleDelete}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )} */}

      {/* --- Update Payment Modal --- */}
      {openUpdatePayment && (
        <div className="transition-all bg-black/30 backdrop-blur-sm w-full z-50 h-screen absolute top-0 left-0 flex items-center justify-center">
          <div className="bg-white relative p-7 w-[25%] rounded-lg overflow-auto">
            <div className="mb-5">
              <div className="flex items-center justify-between">
                <p className="text-xl font-bold">Update Payment</p>
              </div>
            </div>
            <div>
              <form
                className="space-y-5"
                onSubmit={handleSubmit(handleUpdatePayment)}
              >
                <div>
                  <TextField
                    error={!!errors.amount}
                    fullWidth
                    size="small"
                    label="Amount"
                    {...register("amount", {
                      required: "Amount is required",
                    })}
                  />
                  {errors.amount && (
                    <span className="text-red-600 text-xs">
                      {errors.amount.message}
                    </span>
                  )}
                </div>
                <div>
                  <FormControl
                    fullWidth
                    size="small"
                    error={!!errors.paymentMode}
                    className="mb-4"
                  >
                    <InputLabel id="paymentMode-label">Payment Mode</InputLabel>
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
                  </FormControl>
                  {errors.paymentMode && (
                    <span className="text-red-600 text-xs">
                      {errors.paymentMode.message}
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-end gap-2">
                  <Button
                    onClick={() => setOpenUpdatePayment(false)}
                    variant="outlined"
                    disableElevation
                    color="primary"
                    sx={{ textTransform: "none" }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    disableElevation
                    color="primary"
                    sx={{ textTransform: "none" }}
                  >
                    Submit
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Order Modal */}
      {openCancel && (
        <div className="transition-all bg-black/30 backdrop-blur-sm w-full z-50 h-screen absolute top-0 left-0 flex items-center justify-center">
          <div className="bg-white p-7 rounded-lg w-[29rem]">
            <p className="text-lg font-semibold">
              Are you sure you want to cancel "
              {singleOrderFromSalesman?.item?.name}"?
            </p>
            <p className="text-gray-800 my-2">
              Tell us why you are cancelling this order:
            </p>
            <form onSubmit={handleSubmit(handleCancelOrder)}>
              <div>
                <TextField
                  error={!!errors.reason}
                  size="small"
                  label="Reason"
                  variant="outlined"
                  fullWidth
                  {...register("reason", {
                    required: "Reason is required",
                  })}
                />
                {errors.reason && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.reason.message}
                  </p>
                )}
              </div>
              <div className="flex items-center justify-end gap-3 mt-5">
                <Button
                  variant="outlined"
                  disableElevation
                  color="error"
                  sx={{ textTransform: "none" }}
                  onClick={() => setOpenCancel(false)}
                >
                  Keep Order
                </Button>
                <Button
                  disabled={!reason}
                  variant="contained"
                  disableElevation
                  color="error"
                  type="Submit"
                  sx={{ textTransform: "none" }}
                >
                  Cancel Order
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DueOrdersForSalesman;
