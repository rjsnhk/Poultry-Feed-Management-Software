import { useState } from "react";
import { Button, CircularProgress, IconButton, TextField } from "@mui/material";
import { Eye, SquarePen, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { DataGrid } from "@mui/x-data-grid";
import CloseIcon from "@mui/icons-material/Close";
import { MdDoneAll } from "react-icons/md";
import { formatRupee } from "../../../utils/formatRupee.js";
import { useSalesManagerOrder } from "../../../hooks/useSalesManagerOrder.js";
import { MdOutlineCancel } from "react-icons/md";
import { useForm } from "react-hook-form";

const OrdersForManager = () => {
  const [singleOrderId, setSingleOrderId] = useState(null);
  const [openView, setOpenView] = useState(false);
  const [openCancel, setOpenCancel] = useState(false);
  const {
    ordersInSalesManager,
    singleOrderFromSalesManager,
    forwardOrder,
    cancelOrder,
    ordersInSalesManagerLoading,
    singleOrderLoading,
    isForwardingOrder,
    isCancelingOrder,
  } = useSalesManagerOrder(singleOrderId);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const reason = watch("reason");

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 5,
  });

  const handleForwardOrder = (orderId) => {
    forwardOrder(orderId);
  };

  const handleView = (id) => {
    console.log(id);
    setSingleOrderId(id);
    setOpenView(true);
  };

  const handleUpdate = (id) => {
    console.log(id);
  };

  const handleCancelOrder = (data) => {
    data.orderId = singleOrderId;
    console.log(data);
    cancelOrder(data);
    setOpenCancel(false);
  };

  if (
    ordersInSalesManagerLoading ||
    singleOrderLoading ||
    isForwardingOrder ||
    isCancelingOrder
  )
    return (
      <div className="flex-1 flex items-center justify-center h-full w-full">
        <CircularProgress />
      </div>
    );

  const columns = [
    { field: "product", headerName: "Product", flex: 1, maxWidth: 150 },
    { field: "party", headerName: "Party", flex: 1, maxWidth: 150 },
    { field: "date", headerName: "Date", flex: 1, maxWidth: 150 },
    { field: "quantity", headerName: "Quantity", flex: 1, maxWidth: 150 },
    {
      field: "totalAmount",
      headerName: "Total Amount",
      flex: 1,
      maxWidth: 150,
    },
    {
      field: "advanceAmount",
      headerName: "Advance Amount",
      flex: 1,
      maxWidth: 150,
    },
    { field: "dueAmount", headerName: "Due Amount", flex: 1, maxWidth: 150 },
    {
      field: "orderStatus",
      headerName: "Status",
      flex: 1,
      maxWidth: 150,
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
            className="hover:bg-blue-100 active:scale-95 transition-all p-1.5 rounded-lg"
            size={30}
            onClick={() => handleView(params.row.id)}
          />
          <SquarePen
            color="green"
            className="hover:bg-green-100 active:scale-95 transition-all p-1.5 rounded-lg"
            size={30}
            onClick={() => handleUpdate(params.row.id)}
          />
          <MdOutlineCancel
            color="red"
            className="hover:bg-red-100 active:scale-95 transition-all p-1.5 rounded-lg"
            size={30}
            onClick={() => {
              setSingleOrderId(params.row.id);
              setOpenCancel(true);
            }}
          />
        </div>
      ),
    },
  ];

  const rows = ordersInSalesManager?.map((order) => ({
    id: order._id,
    party: order?.party?.companyName,
    date: format(order?.createdAt, "dd MMM yyyy"),
    product: order?.item?.name,
    quantity: `${order.quantity}kg`,
    totalAmount: formatRupee(order.totalAmount),
    advanceAmount: formatRupee(order.advanceAmount),
    dueAmount: formatRupee(order.dueAmount),
    orderStatus: order.orderStatus,
  }));

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
            maxWidth: "1210px",
          },
        }}
        disableColumnResize={false}
      />

      {/* --- View Order Modal --- */}
      {openView && (
        <div className="transition-all bg-black/30 backdrop-blur-sm w-full z-50 h-screen absolute top-0 left-0 flex items-center justify-center">
          <div className="bg-white relative p-7 rounded-lg w-[50%] h-[75%] overflow-auto">
            <div className="mb-5">
              <div className="flex items-center justify-between">
                <p className="text-xl font-bold">Order Details</p>
                {singleOrderFromSalesManager?.orderStatus === "Placed" && (
                  <Button
                    onClick={() =>
                      handleForwardOrder(singleOrderFromSalesManager?._id)
                    }
                    variant="outlined"
                    size="small"
                    disableElevation
                    sx={{
                      borderRadius: "999px",
                      textTransform: "none",
                      fontSize: "14px",
                    }}
                  >
                    Forward to Authorizer
                  </Button>
                )}
                {singleOrderFromSalesManager?.orderStatus ===
                  "ForwardedToAuthorizer" && (
                  <div className="flex items-center gap-2 bg-blue-100 p-1 px-2 rounded-full text-blue-700">
                    <MdDoneAll /> Forwarded to Authorizer
                  </div>
                )}

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
                    </span>{" "}
                    {singleOrderFromSalesManager?.item?.category}
                  </div>
                  <div className="flex items-center justify-between font-semibold">
                    <span className="text-gray-600 font-normal">
                      Product Name:
                    </span>{" "}
                    {singleOrderFromSalesManager?.item?.name}
                  </div>
                  <div className="flex items-center justify-between font-semibold">
                    <span className="text-gray-600 font-normal">Quantity:</span>{" "}
                    {singleOrderFromSalesManager?.quantity} kg
                  </div>
                  <div className="flex items-center justify-between font-semibold">
                    <span className="text-gray-600 font-normal">
                      Placed By:
                    </span>{" "}
                    {singleOrderFromSalesManager?.placedBy?.name}
                  </div>
                  <div className="flex items-center justify-between font-semibold">
                    <span className="text-gray-600 font-normal">
                      Placed Date:
                    </span>{" "}
                    {format(
                      singleOrderFromSalesManager?.createdAt,
                      "dd MMM yyyy"
                    )}
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
                    {formatRupee(singleOrderFromSalesManager?.totalAmount)}
                  </div>
                  <div className="flex items-center justify-between font-semibold text-green-700">
                    <span className="text-gray-600 font-normal">
                      Advance Amount:
                    </span>{" "}
                    {formatRupee(singleOrderFromSalesManager?.advanceAmount)}
                  </div>
                  <div className="flex items-center justify-between font-semibold text-red-700">
                    <span className="text-gray-600 font-normal">
                      Due Amount:
                    </span>{" "}
                    {formatRupee(singleOrderFromSalesManager?.dueAmount)}
                  </div>
                  <div className="flex items-center justify-between font-semibold">
                    <span className="text-gray-600 font-normal">
                      Payment Mode:
                    </span>{" "}
                    {singleOrderFromSalesManager?.paymentMode}
                  </div>
                  <div className="flex items-center justify-between font-semibold">
                    <span className="text-gray-600 font-normal">Due Date:</span>{" "}
                    {format(
                      singleOrderFromSalesManager?.dueDate,
                      "dd MMM yyyy"
                    )}
                  </div>
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
                    </span>{" "}
                    {singleOrderFromSalesManager?.orderStatus ===
                    "Delivered" ? (
                      <span className="text-green-700 bg-green-100 p-1 px-3 rounded-full text-xs">
                        {singleOrderFromSalesManager?.orderStatus}
                      </span>
                    ) : (
                      <span className="text-gray-700 bg-gray-200 p-1 px-3 rounded-full text-xs">
                        {singleOrderFromSalesManager?.orderStatus}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between font-semibold">
                    <span className="text-gray-600 font-normal">
                      Payment Status:
                    </span>
                    {singleOrderFromSalesManager?.paymentStatus ===
                      "Partial" && (
                      <span className="text-yellow-700 bg-yellow-100 p-1 px-3 rounded-full text-xs">
                        {singleOrderFromSalesManager?.paymentStatus}
                      </span>
                    )}
                    {singleOrderFromSalesManager?.paymentStatus === "Paid" && (
                      <span className="text-green-700 bg-green-100 p-1 px-3 rounded-full text-xs">
                        {singleOrderFromSalesManager?.paymentStatus}
                      </span>
                    )}
                    {singleOrderFromSalesManager?.paymentStatus ===
                      "Unpaid" && (
                      <span className="text-red-700 bg-red-100 p-1 px-3 rounded-full text-xs">
                        {singleOrderFromSalesManager?.paymentStatus}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between font-semibold">
                    <span className="text-gray-600 font-normal">
                      Invoice Generated:
                    </span>{" "}
                    {singleOrderFromSalesManager?.invoiceGenerated ===
                    "true" ? (
                      <span className="text-green-700 bg-green-100 p-1 px-3 rounded-full text-xs">
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
                  <p className="bg-gray-100 rounded-lg p-3">
                    {singleOrderFromSalesManager?.notes}
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
                    {format(
                      singleOrderFromSalesManager?.createdAt,
                      "dd MMM yyyy"
                    )}
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
                    {singleOrderFromSalesManager?.assignedWarehouse ? (
                      <div className="flex flex-col items-center">
                        {singleOrderFromSalesManager?.assignedWarehouse?.name}
                        <span className="text-xs font-normal text-gray-600">
                          (
                          {
                            singleOrderFromSalesManager?.assignedWarehouse
                              ?.location
                          }
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
          </div>
        </div>
      )}

      {/* Cancel Order Modal */}
      {openCancel && (
        <div className="transition-all bg-black/30 backdrop-blur-sm w-full z-50 h-screen absolute top-0 left-0 flex items-center justify-center">
          <div className="bg-white p-7 rounded-lg w-[29rem]">
            <p className="text-lg font-semibold">
              Are you sure you want to cancel "
              {singleOrderFromSalesManager?.item?.name}"?
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

export default OrdersForManager;
