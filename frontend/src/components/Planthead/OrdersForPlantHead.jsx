import { useState } from "react";
import {
  Button,
  CircularProgress,
  IconButton,
  TextField,
  Tooltip,
} from "@mui/material";
import { Eye, SquarePen, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { DataGrid } from "@mui/x-data-grid";
import CloseIcon from "@mui/icons-material/Close";
import { formatRupee } from "../../utils/formatRupee.js";
import { usePlantheadOrder } from "../../hooks/usePlanthead.js";
import { useForm } from "react-hook-form";
import { MdOutlineCancel } from "react-icons/md";
import { LuTruck } from "react-icons/lu";

const OrdersForPlantHead = () => {
  const [singleOrderId, setSingleOrderId] = useState(null);
  const [openView, setOpenView] = useState(false);
  const [openDispatch, setOpenDispatch] = useState(false);
  const [openCancel, setOpenCancel] = useState(false);

  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const {
    dispatchOrder,
    singleOrderFromPlanthead,
    singleOrderLoading,
    ordersInPlanthead,
    isDeletingOrder,
    ordersInPlantheadLoading,
    isDispatchingOrder,
    cancelOrder,
    isCancelingOrder,
  } = usePlantheadOrder(singleOrderId);

  const reason = watch("reason");

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 5,
  });

  const handleView = (id) => {
    setSingleOrderId(id);
    setOpenView(true);
  };

  const dispatchDocs = watch("dispatchDocs");
  const dispatchDocsFile = dispatchDocs ? dispatchDocs[0] : null;

  const handleOrderDispatch = (data) => {
    const formData = new FormData();
    formData.append("orderId", singleOrderId);
    formData.append("vehicleNumber", data.vehicleNumber);
    formData.append("driverName", data.driverName);
    formData.append("driverContact", data.driverContact);
    formData.append("transportCompany", data.transportCompany);
    formData.append("dispatchDocs", dispatchDocsFile);
    dispatchOrder(formData, { onSuccess: () => setOpenDispatch(false) });
  };

  const handleCancelOrder = (data) => {
    data.orderId = singleOrderId;
    cancelOrder(data, { onSuccess: () => setOpenCancel(false) });
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
          <Tooltip title="View order details" enterDelay={500} placement="top">
            <Eye
              color="blue"
              className="hover:bg-blue-100 active:scale-95 transition-all p-1.5 rounded-lg"
              size={30}
              onClick={() => handleView(params.row.id)}
            />
          </Tooltip>
          <Tooltip title="Dispatch order" enterDelay={500} placement="top">
            <LuTruck
              color="green"
              className="hover:bg-green-100 active:scale-95 transition-all p-1.5 rounded-lg"
              size={30}
              onClick={() => {
                setOpenDispatch(true);
                setSingleOrderId(params.row.id);
              }}
            />
          </Tooltip>
          <Tooltip title="Cancel order" enterDelay={500} placement="top">
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
        </div>
      ),
    },
  ];

  const rows = ordersInPlanthead?.map((order) => ({
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
  }));

  if (
    ordersInPlantheadLoading ||
    isDeletingOrder ||
    singleOrderLoading ||
    isCancelingOrder
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
          <div className="bg-white relative p-7 rounded-lg w-[50%] max-h-[90%] overflow-auto">
            <div className="mb-5">
              <div className="flex items-center justify-between">
                <p className="text-xl font-bold">Order Details</p>
                <IconButton size="small" onClick={() => setOpenView(false)}>
                  <CloseIcon />
                </IconButton>
              </div>
            </div>

            {/* products table */}
            <div className="relative overflow-x-auto mb-5 max-h-52">
              <table className="w-full text-sm text-left text-gray-500 overflow-auto">
                <thead className="sticky top-0 bg-gray-100 text-gray-800 z-10">
                  <tr>
                    <th scope="col" className="px-6 py-3">
                      Product Name
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Category
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Price/bag
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Quantity
                    </th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {singleOrderFromPlanthead?.items?.map((item) => (
                    <tr
                      key={item._id}
                      className="bg-white border-b border-gray-200"
                    >
                      <th
                        scope="row"
                        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                      >
                        {item?.product?.name}
                      </th>
                      <td className="px-6 py-4">{item?.product?.category}</td>
                      <td className="px-6 py-4">
                        {formatRupee(item?.product?.price)}
                      </td>
                      <td className="px-6 py-4">{item?.quantity} bags</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="grid grid-cols-2 gap-7">
              <div className="flex flex-col gap-5">
                <div className="flex flex-col gap-2 text-sm">
                  <h1 className="font-semibold text-base text-gray-800">
                    Order Information
                  </h1>
                  <div className="flex items-center justify-between font-semibold">
                    <span className="text-gray-600 font-normal">Order Id:</span>
                    #{singleOrderFromPlanthead?.orderId}
                  </div>
                  <div className="flex items-center justify-between font-semibold">
                    <span className="text-gray-600 font-normal">
                      Placed By:
                    </span>
                    {singleOrderFromPlanthead?.placedBy?.name}
                  </div>
                  <div className="flex items-center justify-between font-semibold">
                    <span className="text-gray-600 font-normal">
                      Placed Date:
                    </span>
                    {format(singleOrderFromPlanthead?.createdAt, "dd MMM yyyy")}
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
                    {formatRupee(singleOrderFromPlanthead?.totalAmount)}
                  </div>
                  <div className="flex items-center justify-between font-semibold text-green-700">
                    <span className="text-gray-600 font-normal">
                      Advance Amount:
                    </span>{" "}
                    {formatRupee(singleOrderFromPlanthead?.advanceAmount)}
                  </div>
                  <div className="flex items-center justify-between font-semibold text-red-700">
                    <span className="text-gray-600 font-normal">
                      Due Amount:
                    </span>{" "}
                    {formatRupee(singleOrderFromPlanthead?.dueAmount)}
                  </div>
                  <div className="flex items-center justify-between font-semibold">
                    <span className="text-gray-600 font-normal">
                      Payment Mode:
                    </span>{" "}
                    {singleOrderFromPlanthead?.paymentMode}
                  </div>
                  {singleOrderFromPlanthead?.dueAmount !== 0 && (
                    <div className="flex items-center justify-between font-semibold">
                      <span className="text-gray-600 font-normal">
                        Due Date:
                      </span>{" "}
                      {format(singleOrderFromPlanthead?.dueDate, "dd MMM yyyy")}
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
                    </span>{" "}
                    {singleOrderFromPlanthead?.orderStatus === "Delivered" ? (
                      <span className="text-green-700 bg-green-100 p-1 px-3 rounded-full text-xs">
                        {singleOrderFromPlanthead?.orderStatus}
                      </span>
                    ) : (
                      <span className="text-gray-700 bg-gray-200 p-1 px-3 rounded-full text-xs">
                        {singleOrderFromPlanthead?.orderStatus}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between font-semibold">
                    <span className="text-gray-600 font-normal">
                      Payment Status:
                    </span>
                    {singleOrderFromPlanthead?.paymentStatus ===
                      "PendingDues" && (
                      <span className="text-red-700 bg-red-100 p-1 px-3 rounded-full text-xs">
                        Pending Dues
                      </span>
                    )}
                    {singleOrderFromPlanthead?.paymentStatus === "Paid" && (
                      <span className="text-green-700 bg-green-100 p-1 px-3 rounded-full text-xs">
                        Paid
                      </span>
                    )}
                    {singleOrderFromPlanthead?.paymentStatus ===
                      "ConfirmationPending" && (
                      <span className="text-yellow-700 bg-yellow-100 p-1 px-3 rounded-full text-xs">
                        Confirmation Pending
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between font-semibold">
                    <span className="text-gray-600 font-normal">
                      Invoice Generated:
                    </span>{" "}
                    {singleOrderFromPlanthead?.invoiceGenerated === "true" ? (
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

                {/* order timeline */}
                <div className="flex flex-col gap-2 text-sm">
                  <h1 className="font-semibold text-base text-gray-800">
                    Order Timeline
                  </h1>
                  <div className="flex items-center justify-between font-semibold">
                    <span className="text-gray-600 font-normal">
                      Order Placed On:
                    </span>{" "}
                    {format(singleOrderFromPlanthead?.createdAt, "dd MMM yyyy")}
                  </div>
                </div>

                {/* assigned warehouse */}
                <div className="flex flex-col gap-2 text-sm">
                  <h1 className="font-semibold text-base text-gray-800">
                    Assigned Warehouse
                  </h1>
                  <div className="flex items-center justify-between font-semibold">
                    <span className="text-gray-600 font-normal">
                      Warehouse:
                    </span>
                    {singleOrderFromPlanthead?.assignedWarehouse ? (
                      <div className="flex flex-col items-center">
                        {singleOrderFromPlanthead?.assignedWarehouse?.name}
                        <span className="text-xs font-normal text-gray-600">
                          (
                          {
                            singleOrderFromPlanthead?.assignedWarehouse
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
                  <div className="flex items-center justify-between font-semibold">
                    <span className="text-gray-600 font-normal">
                      Warehouse Approval:
                    </span>
                    {singleOrderFromPlanthead?.approvedBy ? (
                      <span className="text-green-700 font-semibold bg-green-100 p-1 px-3 rounded-full text-xs">
                        Approved
                      </span>
                    ) : (
                      <span className="text-red-700 font-semibold bg-red-100 p-1 px-3 rounded-full text-xs">
                        Pending
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* notes  */}
            <div className="flex flex-col gap-2 text-sm mt-5">
              <h1 className="font-semibold text-base text-gray-800">Notes</h1>
              <div className="bg-yellow-50 rounded-lg p-3 w-full">
                <p className="break-words whitespace-normal">
                  {singleOrderFromPlanthead?.notes}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- Dispatch Order Modal --- */}
      {openDispatch && (
        <div className="transition-all bg-black/30 backdrop-blur-sm w-full z-50 h-screen absolute top-0 left-0 flex items-center justify-center">
          <div className="bg-white relative p-7 rounded-lg w-[30%] overflow-auto">
            <div className="flex items-center justify-between">
              <p className="text-xl font-bold">Dispatch Order</p>
              <IconButton size="small" onClick={() => setOpenDispatch(false)}>
                <CloseIcon />
              </IconButton>
            </div>
            {/* {singleOrderFromPlanthead?.dueAmount > 0 && (
              <div className="mt-2">
                <p className="p-2 text-sm bg-red-50 text-red-600 rounded-lg">
                  Firsly ask <b>{singleOrderFromPlanthead?.placedBy?.name}</b>{" "}
                  to clear due amount of{" "}
                  <b>{formatRupee(singleOrderFromPlanthead?.dueAmount)}</b> to
                  dispatch the order.
                </p>
              </div>
            )} */}
            <div className="mt-5">
              <form
                className="space-y-5"
                onSubmit={handleSubmit(handleOrderDispatch)}
              >
                <div>
                  <TextField
                    fullWidth
                    error={!!errors?.driverName}
                    // disabled={singleOrderFromPlanthead?.dueAmount > 0}
                    size="small"
                    label="Driver Name"
                    variant="outlined"
                    {...register("driverName", {
                      required: {
                        value: true,
                        message: "Driver Name is required",
                      },
                    })}
                  />
                  {errors?.driverName && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors?.driverName?.message}
                    </p>
                  )}
                </div>
                <div>
                  <TextField
                    fullWidth
                    error={!!errors?.driverContact}
                    // disabled={singleOrderFromPlanthead?.dueAmount > 0}
                    size="small"
                    type="number"
                    label="Driver Contact"
                    variant="outlined"
                    {...register("driverContact", {
                      required: {
                        value: true,
                        message: "Driver Contact is required",
                      },
                    })}
                  />
                  {errors?.driverContact && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors?.driverContact?.message}
                    </p>
                  )}
                </div>
                <div>
                  <TextField
                    fullWidth
                    error={!!errors?.vehicleNumber}
                    // disabled={singleOrderFromPlanthead?.dueAmount > 0}
                    size="small"
                    label="Vehicle Number"
                    variant="outlined"
                    {...register("vehicleNumber", {
                      required: {
                        value: true,
                        message: "Vehicle Number is required",
                      },
                    })}
                  />
                  {errors?.vehicleNumber && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors?.vehicleNumber?.message}
                    </p>
                  )}
                </div>
                <div>
                  <TextField
                    fullWidth
                    // disabled={singleOrderFromPlanthead?.dueAmount > 0}
                    error={!!errors?.transportCompany}
                    size="small"
                    label="Transport Company"
                    variant="outlined"
                    {...register("transportCompany", {
                      required: {
                        value: true,
                        message: "Transport Company is required",
                      },
                    })}
                  />
                  {errors?.transportCompany && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors?.transportCompany?.message}
                    </p>
                  )}
                </div>
                <div>
                  <span className="text-sm mb-1 ms-3 text-gray-600">
                    Upload Dispatch Documents
                  </span>
                  <input
                    // disabled={singleOrderFromPlanthead?.dueAmount > 0}
                    className="relative mt-1 block w-full min-w-0 flex-auto rounded border border-solid border-neutral-300 bg-clip-padding px-3 py-[0.32rem] text-base font-normal text-neutral-700 transition duration-300 ease-in-out file:-mx-3 file:-my-[0.32rem] file:overflow-hidden file:rounded-none file:border-0 file:border-solid file:border-inherit file:bg-neutral-100 file:px-3 file:py-[0.32rem] file:text-neutral-700 file:transition file:duration-150 file:ease-in-out file:[border-inline-end-width:1px] file:[margin-inline-end:0.75rem] hover:file:bg-neutral-200 focus:border-primary focus:text-neutral-700 focus:shadow-te-primary focus:outline-none "
                    type="file"
                    id="formFileMultiple"
                    multiple
                    {...register("dispatchDocs", {
                      required: {
                        value: true,
                        message: "Dispatch Documents are required",
                      },
                    })}
                  />
                  {errors.dispatchDocs && (
                    <p className="text-red-600 text-xs mt-1">
                      {errors.dispatchDocs.message}
                    </p>
                  )}
                </div>
                <div className="flex items-center justify-end gap-3 mt-5">
                  <Button
                    variant="outlined"
                    disableElevation
                    sx={{ textTransform: "none" }}
                    onClick={() => setOpenDispatch(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    // disabled={singleOrderFromPlanthead?.dueAmount > 0}
                    loading={isDispatchingOrder}
                    loadingPosition="start"
                    variant="contained"
                    disableElevation
                    sx={{ textTransform: "none" }}
                    type="submit"
                  >
                    Dispatch
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
              {singleOrderFromPlanthead?.item?.name}"?
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

export default OrdersForPlantHead;
