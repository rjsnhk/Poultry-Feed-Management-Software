import { useState } from "react";
import { Button, CircularProgress, IconButton, Tooltip } from "@mui/material";
import { Download, Eye, File, FileImage } from "lucide-react";
import { format } from "date-fns";
import { DataGrid } from "@mui/x-data-grid";
import CloseIcon from "@mui/icons-material/Close";
import { formatRupee } from "../../utils/formatRupee.js";
import { useAccountantOrder } from "../../hooks/useAccountant.js";
import { TbFileInvoice } from "react-icons/tb";
import { downloadFile } from "../../utils/downloadFile.js";
import { useUser } from "../../hooks/useUser.js";

const ApproveAdvancePaymentOrders = () => {
  const [singleOrderId, setSingleOrderId] = useState(null);
  const [openView, setOpenView] = useState(false);
  const [openInvoice, setOpenInvoice] = useState(false);

  const { user } = useUser();

  const {
    ordersToApprovePayment,
    ordersToApprovePaymentLoading,
    singleOrderInAccountant,
    singleOrderInAccountantLoading,
    approveOrderPayment,
    isApprovingOrderPayment,
  } = useAccountantOrder(singleOrderId);

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
          <Tooltip title="View Order" placement="left" enterDelay={500}>
            <Eye
              color="blue"
              className="hover:bg-blue-200 active:scale-95 transition-all p-1.5 rounded-lg"
              size={30}
              onClick={() => handleView(params.row.id)}
            />
          </Tooltip>
          <Tooltip
            title="View advance payment invoice"
            enterDelay={500}
            placement="top"
          >
            <FileImage
              strokeWidth={2.1}
              color="green"
              className="hover:bg-green-200 active:scale-95 transition-all p-1.5 rounded-lg"
              size={30}
              onClick={() => {
                setSingleOrderId(params.row.id);
                setOpenInvoice(true);
              }}
            />
          </Tooltip>
        </div>
      ),
    },
  ];

  const rows = ordersToApprovePayment?.map((order) => ({
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

  if (ordersToApprovePaymentLoading || singleOrderInAccountantLoading)
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
                <Button
                  loading={isApprovingOrderPayment}
                  onClick={() => {
                    approveOrderPayment(singleOrderId);
                    setOpenView(false);
                  }}
                  sx={{
                    textTransform: "none",
                  }}
                >
                  Approve advance payment
                </Button>
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
                    {singleOrderInAccountant?.items?.map((item) => (
                      <tr className="bg-white border-b border-gray-200">
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
                    <span className="text-gray-600 font-normal">Order ID:</span>
                    #{singleOrderInAccountant?.orderId}
                  </div>
                  <div className="flex items-center justify-between font-semibold">
                    <span className="text-gray-600 font-normal">
                      Placed By:
                    </span>
                    {singleOrderInAccountant?.placedBy?.name}
                  </div>
                  <div className="flex items-center justify-between font-semibold">
                    <span className="text-gray-600 font-normal">
                      Placed Date:
                    </span>
                    {format(singleOrderInAccountant?.createdAt, "dd MMM yyyy")}
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
                    {formatRupee(singleOrderInAccountant?.totalAmount)}
                  </div>
                  <div className="flex items-center justify-between font-semibold text-green-700">
                    <span className="text-gray-600 font-normal">
                      Advance Amount:
                    </span>{" "}
                    {formatRupee(singleOrderInAccountant?.advanceAmount)}
                  </div>
                  <div className="flex items-center justify-between font-semibold text-red-700">
                    <span className="text-gray-600 font-normal">
                      Due Amount:
                    </span>{" "}
                    {formatRupee(singleOrderInAccountant?.dueAmount)}
                  </div>
                  <div className="flex items-center justify-between font-semibold">
                    <span className="text-gray-600 font-normal">
                      Payment Mode:
                    </span>{" "}
                    {singleOrderInAccountant?.paymentMode}
                  </div>
                  <div className="flex items-center justify-between font-semibold">
                    <span className="text-gray-600 font-normal">Due Date:</span>{" "}
                    {format(singleOrderInAccountant?.dueDate, "dd MMM yyyy")}
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
                    {singleOrderInAccountant?.orderStatus === "Delivered" ? (
                      <span className="text-green-700 bg-green-100 p-1 px-3 rounded-full text-xs">
                        {singleOrderInAccountant?.orderStatus}
                      </span>
                    ) : (
                      <span className="text-gray-700 bg-gray-200 p-1 px-3 rounded-full text-xs">
                        {singleOrderInAccountant?.orderStatus}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between font-semibold">
                    <span className="text-gray-600 font-normal">
                      Payment Status:
                    </span>
                    {singleOrderInAccountant?.paymentStatus ===
                      "PendingDues" && (
                      <span className="text-red-700 bg-red-100 p-1 px-3 rounded-full text-xs">
                        Pending Dues
                      </span>
                    )}
                    {singleOrderInAccountant?.paymentStatus === "Paid" && (
                      <span className="text-green-700 bg-green-100 p-1 px-3 rounded-full text-xs">
                        Paid
                      </span>
                    )}
                    {singleOrderInAccountant?.paymentStatus ===
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
                    {singleOrderInAccountant?.invoiceGenerated === true ? (
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
                    Order Timeline
                  </h1>
                  <div className="flex items-center justify-between font-semibold">
                    <span className="text-gray-600 font-normal">
                      Order Placed On:
                    </span>
                    {format(singleOrderInAccountant?.createdAt, "dd MMM yyyy")}
                  </div>
                </div>

                {singleOrderInAccountant?.assignedWarehouse && (
                  <div className="flex flex-col gap-2 text-sm">
                    <div className="flex justify-between text-sm">
                      <h1 className="font-semibold text-base text-gray-800">
                        Assigned Warehouse
                      </h1>
                    </div>
                    <div className="flex items-center justify-between font-semibold">
                      <span className="text-gray-600 font-normal">
                        Warehouse:
                      </span>
                      {singleOrderInAccountant?.assignedWarehouse ? (
                        <div className="flex items-center">
                          <p>
                            {singleOrderInAccountant?.assignedWarehouse?.name}
                          </p>
                          &nbsp;
                          <p className="text-xs font-normal text-gray-600">
                            (
                            {
                              singleOrderInAccountant?.assignedWarehouse
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
                      {singleOrderInAccountant?.approvedBy ? (
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
                )}
              </div>
            </div>
            <div className="flex flex-col gap-2 text-sm mt-5">
              <h1 className="font-semibold text-base text-gray-800">Notes</h1>
              <div className="bg-yellow-50 rounded-lg p-3 w-full">
                <p className="break-words whitespace-normal">
                  {singleOrderInAccountant?.notes}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Open Invoice Modal */}
      {openInvoice && (
        <div className="transition-all bg-black/30 backdrop-blur-sm w-full z-50 h-screen absolute top-0 left-0 flex items-center justify-center">
          <div className="bg-white relative p-7 rounded-lg max-w-[60%] min-w-[35%] max-h-[90%] overflow-auto">
            <div className="mb-5">
              <div className="flex items-center justify-between">
                <p className="text-xl font-bold">Invoice</p>
                <div className="flex items-center gap-5">
                  {user.isActive ? (
                    <Tooltip
                      title="Download invoice"
                      enterDelay={500}
                      placement="top"
                    >
                      <Download
                        color="blue"
                        className="hover:bg-blue-200 active:scale-95 transition-all p-1.5 rounded-lg"
                        size={30}
                        onClick={() =>
                          downloadFile(
                            singleOrderInAccountant?.advancePaymentDoc,
                            "invoice"
                          )
                        }
                      />
                    </Tooltip>
                  ) : (
                    <Download
                      color="blue"
                      className="hover:bg-blue-200 active:scale-95 transition-all p-1.5 rounded-lg"
                      size={30}
                      onClick={() =>
                        downloadFile(
                          singleOrderInAccountant?.advancePaymentDoc,
                          "invoice"
                        )
                      }
                    />
                  )}
                  <IconButton
                    size="small"
                    onClick={() => setOpenInvoice(false)}
                  >
                    <CloseIcon />
                  </IconButton>
                </div>
              </div>
            </div>

            <div className="rounded-lg shadow mb-5">
              {singleOrderInAccountant?.advancePaymentDoc?.endsWith(".pdf") ? (
                <iframe
                  src={singleOrderInAccountant?.advancePaymentDoc}
                  className="w-full h-96"
                  title="Advance Payment Invoice PDF"
                />
              ) : (
                <Tooltip title="Click to view invoice in new tab" followCursor>
                  <a
                    href={singleOrderInAccountant?.advancePaymentDoc}
                    target="_blank"
                  >
                    <img
                      src={singleOrderInAccountant?.advancePaymentDoc}
                      className="w-full h-full object-contain"
                      alt="Advance Payment Invoice"
                    />
                  </a>
                </Tooltip>
              )}
            </div>

            <div className="grid grid-cols-2 gap-7">
              <div className="flex flex-col gap-2 text-sm">
                <h1 className="font-semibold text-base text-gray-800">
                  Placed By
                </h1>
                <div className="flex items-center justify-between font-semibold">
                  <span className="text-gray-600 font-normal">Name:</span>
                  {singleOrderInAccountant?.placedBy?.name}
                </div>
                <div className="flex items-center justify-between font-semibold">
                  <span className="text-gray-600 font-normal">Email:</span>
                  {singleOrderInAccountant?.placedBy?.email}
                </div>
              </div>
              <div className="flex flex-col gap-2 text-sm">
                <h1 className="font-semibold text-base text-gray-800">
                  Payment Details
                </h1>
                <div className="flex items-center justify-between font-semibold">
                  <span className="text-gray-600 font-normal">
                    Advance Amount:
                  </span>
                  {formatRupee(singleOrderInAccountant?.advanceAmount)}
                </div>
                <div className="flex items-center justify-between font-semibold">
                  <span className="text-gray-600 font-normal">
                    Payment Mode:
                  </span>
                  {singleOrderInAccountant?.paymentMode}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApproveAdvancePaymentOrders;
