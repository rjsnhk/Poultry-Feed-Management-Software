import { useState } from "react";
import { CircularProgress, IconButton, Tooltip } from "@mui/material";
import { Eye } from "lucide-react";
import { format } from "date-fns";
import { DataGrid } from "@mui/x-data-grid";
import CloseIcon from "@mui/icons-material/Close";
import { formatRupee } from "../../../utils/formatRupee.js";
import { MdOutlineWarehouse } from "react-icons/md";
import { useSalesAuthorizerOrder } from "../../../hooks/useSalesAuthorizerOrder.js";

const AssignmentHistory = () => {
  const [singleOrderId, setSingleOrderId] = useState(null);
  const [openView, setOpenView] = useState(false);
  const [openWarehouseStatus, setOpenWarehouseStatus] = useState(false);

  const {
    AuthorizerAssignmentHistory,
    AuthorizerAssignmentHistoryLoading,
    singleOrderFromSalesauthorizer,
    ApprovedOrderForWarehouse,
    ApprovedOrderForWarehouseLoading,
    singleOrderLoading,
  } = useSalesAuthorizerOrder(singleOrderId);

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 5,
  });

  const handleView = (id) => {
    console.log(id);
    setSingleOrderId(id);
    setOpenView(true);
  };

  const columns = [
    {
      field: "orderId",
      headerName: "Order ID",
      flex: 1,
      minWidth: 80,
      maxWidth: 100,
    },
    { field: "warehouseName", headerName: "Warehouse", flex: 1 },
    { field: "location", headerName: "Location", flex: 1 },
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
          <Tooltip title="View Order" placement="left" enterDelay={500}>
            <Eye
              className="flex items-center gap-2 hover:bg-blue-100 active:scale-95 transition-all p-1.5 rounded-lg"
              color="blue"
              onClick={() => handleView(params.row.id)}
              size={30}
            />
          </Tooltip>
          {params.row.orderStatus === "Approved" && (
            <Tooltip
              title="Warehouse Status"
              placement="right"
              enterDelay={500}
            >
              <MdOutlineWarehouse
                className="flex items-center gap-2 hover:bg-orange-100 active:scale-95 transition-all p-1.5 rounded-lg"
                color="orange"
                size={30}
                onClick={() => {
                  setSingleOrderId(params.row.id);
                  setOpenWarehouseStatus(true);
                }}
              />
            </Tooltip>
          )}
        </div>
      ),
    },
  ];

  const rows = AuthorizerAssignmentHistory?.map((order) => ({
    id: order._id,
    orderId: `#${order.orderId}`,
    warehouseName: order?.assignedWarehouse?.name,
    location: order?.assignedWarehouse?.location,
    orderStatus: order.orderStatus,
  }));

  if (
    AuthorizerAssignmentHistoryLoading ||
    singleOrderLoading ||
    ApprovedOrderForWarehouseLoading
  )
    return (
      <div className="flex-1 flex items-center justify-center h-full w-full">
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
          <div className="bg-white relative p-7 rounded-lg min-w-[50%] max-w-[55%] max-h-[90%] overflow-auto">
            <div className="mb-5">
              <div className="flex items-center justify-between">
                <p className="text-xl font-bold">Order Details</p>
                <IconButton size="small" onClick={() => setOpenView(false)}>
                  <CloseIcon />
                </IconButton>
              </div>

              {/* products table */}
              <div className="relative overflow-x-auto mt-5 max-h-52">
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
                    {singleOrderFromSalesauthorizer?.items?.map((item) => (
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
            </div>
            <div className="grid grid-cols-2 gap-7">
              <div className="flex flex-col gap-5">
                <div className="flex flex-col gap-2 text-sm">
                  <h1 className="font-semibold text-base text-gray-800">
                    Order Information
                  </h1>
                  <div className="flex items-center justify-between font-semibold">
                    <span className="text-gray-600 font-normal">Order Id:</span>
                    #{singleOrderFromSalesauthorizer?.orderId}
                  </div>
                  <div className="flex items-center justify-between font-semibold">
                    <span className="text-gray-600 font-normal">
                      Placed By:
                    </span>
                    {singleOrderFromSalesauthorizer?.placedBy?.name}
                  </div>
                  <div className="flex items-center justify-between font-semibold">
                    <span className="text-gray-600 font-normal">
                      Placed Date:
                    </span>
                    {format(
                      singleOrderFromSalesauthorizer?.createdAt,
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
                    {formatRupee(singleOrderFromSalesauthorizer?.totalAmount)}
                  </div>
                  <div className="flex items-center justify-between font-semibold text-green-700">
                    <span className="text-gray-600 font-normal">
                      Advance Amount:
                    </span>
                    {formatRupee(singleOrderFromSalesauthorizer?.advanceAmount)}
                  </div>
                  <div className="flex items-center justify-between font-semibold text-red-700">
                    <span className="text-gray-600 font-normal">
                      Due Amount:
                    </span>
                    {formatRupee(singleOrderFromSalesauthorizer?.dueAmount)}
                  </div>
                  <div className="flex items-center justify-between font-semibold">
                    <span className="text-gray-600 font-normal">
                      Payment Mode:
                    </span>
                    {singleOrderFromSalesauthorizer?.paymentMode}
                  </div>
                  <div className="flex items-center justify-between font-semibold">
                    <span className="text-gray-600 font-normal">Due Date:</span>
                    {format(
                      singleOrderFromSalesauthorizer?.dueDate,
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
                    </span>
                    {singleOrderFromSalesauthorizer?.orderStatus ===
                    "Delivered" ? (
                      <span className="text-green-700 bg-green-100 p-1 px-3 rounded-full text-xs">
                        {singleOrderFromSalesauthorizer?.orderStatus}
                      </span>
                    ) : singleOrderFromSalesauthorizer?.orderStatus ===
                      "Cancelled" ? (
                      <span className="text-red-700 bg-red-100 p-1 px-3 rounded-full text-xs">
                        {singleOrderFromSalesauthorizer?.orderStatus}
                      </span>
                    ) : (
                      <span className="text-gray-700 bg-gray-200 p-1 px-3 rounded-full text-xs">
                        {singleOrderFromSalesauthorizer?.orderStatus}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between font-semibold">
                    <span className="text-gray-600 font-normal">
                      Payment Status:
                    </span>
                    {singleOrderFromSalesauthorizer?.paymentStatus ===
                      "PendingDues" && (
                      <span className="text-red-700 bg-red-100 p-1 px-3 rounded-full text-xs">
                        Pending Dues
                      </span>
                    )}
                    {singleOrderFromSalesauthorizer?.paymentStatus ===
                      "Paid" && (
                      <span className="text-green-700 bg-green-100 p-1 px-3 rounded-full text-xs">
                        Paid
                      </span>
                    )}
                    {singleOrderFromSalesauthorizer?.paymentStatus ===
                      "ConfirmationPending" && (
                      <span className="text-yellow-700 bg-yellow-100 p-1 px-3 rounded-full text-xs">
                        Confirmation Pending
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between font-semibold">
                    <span className="text-gray-600 font-normal">
                      Invoice Generated:
                    </span>
                    {singleOrderFromSalesauthorizer?.invoiceGenerated ? (
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

                {/* order timeline */}
                <div className="flex flex-col gap-2 text-sm">
                  <h1 className="font-semibold text-base text-gray-800">
                    Order Timeline
                  </h1>
                  <div className="flex items-center justify-between font-semibold">
                    <span className="text-gray-600 font-normal">
                      Order Placed On:
                    </span>{" "}
                    {format(
                      singleOrderFromSalesauthorizer?.createdAt,
                      "dd MMM yyyy"
                    )}
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
                    {singleOrderFromSalesauthorizer?.assignedWarehouse ? (
                      <div className="flex items-center">
                        <p>
                          {
                            singleOrderFromSalesauthorizer?.assignedWarehouse
                              ?.name
                          }
                        </p>
                        &nbsp;
                        <p className="text-xs font-normal text-gray-600">
                          (
                          {
                            singleOrderFromSalesauthorizer?.assignedWarehouse
                              ?.location
                          }
                          )
                        </p>
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
                    {singleOrderFromSalesauthorizer?.approvedBy ? (
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
                  {singleOrderFromSalesauthorizer?.notes}
                </p>
              </div>
            </div>

            {/* dispatch info */}
            {singleOrderFromSalesauthorizer?.dispatchInfo && (
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
                      {singleOrderFromSalesauthorizer?.dispatchInfo?.driverName}
                    </div>
                    <div className="flex items-center justify-between font-semibold">
                      <span className="text-gray-600 font-normal">
                        Driver Contact
                      </span>
                      {
                        singleOrderFromSalesauthorizer?.dispatchInfo
                          ?.driverContact
                      }
                    </div>
                    <div className="flex items-center justify-between font-semibold">
                      <span className="text-gray-600 font-normal">
                        Transport Company:
                      </span>{" "}
                      {
                        singleOrderFromSalesauthorizer?.dispatchInfo
                          ?.transportCompany
                      }
                    </div>
                    <div className="flex items-center justify-between font-semibold">
                      <span className="text-gray-600 font-normal">
                        Vehicle Number:
                      </span>{" "}
                      {
                        singleOrderFromSalesauthorizer?.dispatchInfo
                          ?.vehicleNumber
                      }
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 text-sm">
                    <div className="flex items-center justify-between font-semibold">
                      <span className="text-gray-600 font-normal">
                        Dispatched By:
                      </span>{" "}
                      {
                        singleOrderFromSalesauthorizer?.dispatchInfo
                          ?.dispatchedBy?.name
                      }
                    </div>
                    <div className="flex items-center justify-between font-semibold">
                      <span className="text-gray-600 font-normal">
                        Plant Head Contact:
                      </span>{" "}
                      {
                        singleOrderFromSalesauthorizer?.dispatchInfo
                          ?.dispatchedBy?.phone
                      }
                    </div>
                    <div className="flex items-center justify-between font-semibold">
                      <span className="text-gray-600 font-normal">
                        Dispatched Date:
                      </span>{" "}
                      {format(
                        singleOrderFromSalesauthorizer?.dispatchInfo
                          ?.dispatchDate,
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

      {/* --- View Order Modal --- */}
      {openWarehouseStatus && (
        <div className="transition-all bg-black/30 backdrop-blur-sm w-full z-50 h-screen absolute top-0 left-0 flex items-center justify-center">
          <div className="bg-white relative p-7 rounded-lg w-[30%] overflow-auto">
            <div className="mb-5">
              <div className="flex items-center justify-between">
                <p className="text-xl font-bold">Warehouse Approval Details</p>
                <IconButton
                  size="small"
                  onClick={() => setOpenWarehouseStatus(false)}
                >
                  <CloseIcon />
                </IconButton>
              </div>
            </div>
            <div className="">
              <div className="flex flex-col gap-5">
                <div className="flex flex-col gap-2 text-sm">
                  <h1 className="font-semibold text-base text-gray-800">
                    Approval Information
                  </h1>
                  <div className="flex items-center justify-between font-semibold">
                    <span className="text-gray-600 font-normal">
                      Warehouse Status:
                    </span>
                    {ApprovedOrderForWarehouse?.approvedBy !== null ? (
                      <span className="text-green-600 text-xs bg-green-100 p-1 px-2 rounded-full">
                        Approved
                      </span>
                    ) : (
                      <span className="text-red-600 text-xs bg-red-100 p-1 px-2 rounded-full">
                        Not Approved
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between font-semibold">
                    <span className="text-gray-600 font-normal">
                      Order Status:
                    </span>
                    {ApprovedOrderForWarehouse?.orderStatus === "Delivered" ? (
                      <span className="text-green-600 text-xs bg-green-100 p-1 px-2 rounded-full">
                        {ApprovedOrderForWarehouse?.orderStatus}
                      </span>
                    ) : ApprovedOrderForWarehouse?.orderStatus ===
                      "Cancelled" ? (
                      <span className="text-red-600 text-xs bg-red-100 p-1 px-2 rounded-full">
                        {ApprovedOrderForWarehouse?.orderStatus}
                      </span>
                    ) : (
                      <span className="text-gray-800 text-xs bg-gray-200 p-1 px-2 rounded-full">
                        {ApprovedOrderForWarehouse?.orderStatus}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between font-semibold">
                    <span className="text-gray-600 font-normal">
                      Approved By:
                    </span>
                    {ApprovedOrderForWarehouse?.approvedBy?.name}
                  </div>
                  <div className="flex items-center justify-between font-semibold">
                    <span className="text-gray-600 font-normal">Email:</span>
                    {ApprovedOrderForWarehouse?.approvedBy?.email}
                  </div>
                </div>
                <div className="flex flex-col gap-2 text-sm">
                  <h1 className="font-semibold text-base text-gray-800">
                    Warehouse Details
                  </h1>
                  <div className="flex items-center justify-between font-semibold">
                    <span className="text-gray-600 font-normal">Name:</span>
                    {ApprovedOrderForWarehouse?.assignedWarehouse?.name}
                  </div>
                  <div className="flex items-center justify-between font-semibold">
                    <span className="text-gray-600 font-normal">Location:</span>
                    {ApprovedOrderForWarehouse?.assignedWarehouse?.location}
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

export default AssignmentHistory;
