import { useState } from "react";
import { Button, CircularProgress, IconButton, Tooltip } from "@mui/material";
import { Eye, SquarePen, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { DataGrid } from "@mui/x-data-grid";
import CloseIcon from "@mui/icons-material/Close";
import { formatRupee } from "../../utils/formatRupee.js";
import { useAccountantOrder } from "../../hooks/useAccountant.js";
import { TbFileInvoice } from "react-icons/tb";

const OrdersForAccountant = () => {
  const [singleOrderId, setSingleOrderId] = useState(null);
  const [openView, setOpenView] = useState(false);
  const [openInvoice, setOpenInvoice] = useState(false);

  const {
    ordersInAccountant,
    generateInvoice,
    ordersInAccountantLoading,
    singleOrderInAccountant,
    singleOrderInAccountantLoading,
    isGettingInvoice,
  } = useAccountantOrder(singleOrderId);

  console.log(ordersInAccountant);

  console.log("singleOrderInAccountant", singleOrderInAccountant);

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 5,
  });

  const handleView = (id) => {
    console.log(id);
    setSingleOrderId(id);
    setOpenView(true);
  };

  const handleGetInvoice = (id) => {
    console.log(id);
    setSingleOrderId(id);
    setOpenInvoice(true);
  };

  const handleInvoiceGeneration = () => {
    console.log(singleOrderId);
    const data = {
      orderId: singleOrderId,
      dueDate: format(singleOrderInAccountant?.dueDate, "yyyy-MM-dd"),
    };
    generateInvoice(data);
  };

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
      renderCell: (params) => (
        console.log(params.value),
        (
          <span className={`${params.value !== "₹0" && "text-green-700"}`}>
            {params.value}
          </span>
        )
      ),
    },
    {
      field: "dueAmount",
      headerName: "Due Amount",
      flex: 1,
      maxWidth: 150,
      renderCell: (params) => (
        console.log(params.value),
        (
          <span className={`${params.value !== "₹0" && "text-red-600"}`}>
            {params.value}
          </span>
        )
      ),
    },
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
          <Tooltip title="View Order" placement="left" enterDelay={500}>
            <Eye
              color="blue"
              className="hover:bg-blue-200 active:scale-95 transition-all p-1.5 rounded-lg"
              size={30}
              onClick={() => handleView(params.row.id)}
            />
          </Tooltip>
          {params.row.invoiceGenerated === true && (
            <Tooltip title="View invoice" enterDelay={500} placement="right">
              <TbFileInvoice
                color="green"
                className="hover:bg-green-200 active:scale-95 transition-all p-1.5 rounded-lg"
                size={30}
                onClick={() => handleGetInvoice(params.row.id)}
              />
            </Tooltip>
          )}
        </div>
      ),
    },
  ];

  const rows = ordersInAccountant?.map((order) => ({
    id: order._id,
    party: order?.party?.companyName,
    date: format(order?.createdAt, "dd MMM yyyy"),
    product: order?.item?.name,
    quantity: `${order.quantity}kg`,
    totalAmount: formatRupee(order.totalAmount),
    advanceAmount: formatRupee(order.advanceAmount),
    dueAmount: formatRupee(order.dueAmount),
    orderStatus: order.orderStatus,
    invoiceGenerated: order.invoiceGenerated,
  }));

  if (
    ordersInAccountantLoading ||
    singleOrderInAccountantLoading ||
    isGettingInvoice
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
            maxWidth: "1210px",
          },
        }}
        disableColumnResize={false}
      />
      {/* --- View Order Modal --- */}
      {openView && (
        <div className="transition-all bg-black/30 backdrop-blur-sm w-full z-50 h-screen absolute top-0 left-0 flex items-center justify-center">
          <div className="bg-white relative p-7 rounded-lg w-[50%] h-[70%] overflow-auto">
            <div className="mb-5">
              <div className="flex items-center justify-between">
                <p className="text-xl font-bold">Order Details</p>
                {/* {singleOrderInAccountant?.paymentStatus === "Paid" ? (
                  <Button onClick={handleInvoiceGeneration}>
                    Generate Invoice
                  </Button>
                ) : (
                  <Tooltip
                    placement="top"
                    title="Cannot generate invoice as order is not paid, ask salesman to clear dues"
                  >
                    <span>
                      <Button disabled>Generate Invoice</Button>
                    </span>
                  </Tooltip>
                )} */}
                <Button onClick={handleInvoiceGeneration}>
                  Generate Invoice
                </Button>
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
                    {singleOrderInAccountant?.item?.category}
                  </div>
                  <div className="flex items-center justify-between font-semibold">
                    <span className="text-gray-600 font-normal">
                      Product Name:
                    </span>{" "}
                    {singleOrderInAccountant?.item?.name}
                  </div>
                  <div className="flex items-center justify-between font-semibold">
                    <span className="text-gray-600 font-normal">Quantity:</span>{" "}
                    {singleOrderInAccountant?.quantity} kg
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
                    {singleOrderInAccountant?.paymentStatus === "Partial" && (
                      <span className="text-yellow-700 bg-yellow-100 p-1 px-3 rounded-full text-xs">
                        {singleOrderInAccountant?.paymentStatus}
                      </span>
                    )}
                    {singleOrderInAccountant?.paymentStatus === "Paid" && (
                      <span className="text-green-700 bg-green-100 p-1 px-3 rounded-full text-xs">
                        {singleOrderInAccountant?.paymentStatus}
                      </span>
                    )}
                    {singleOrderInAccountant?.paymentStatus === "Unpaid" && (
                      <span className="text-red-700 bg-red-100 p-1 px-3 rounded-full text-xs">
                        {singleOrderInAccountant?.paymentStatus}
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
                    Notes
                  </h1>
                  <p className="bg-green-50 rounded-lg p-3">
                    {singleOrderInAccountant?.notes}
                  </p>
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
                <div className="flex flex-col gap-2 text-sm">
                  <h1 className="font-semibold text-base text-gray-800">
                    Assigned Warehouse
                  </h1>
                  <div className="flex items-center justify-between font-semibold">
                    <span className="text-gray-600 font-normal">
                      Warehouse:
                    </span>
                    {singleOrderInAccountant?.assignedWarehouse ? (
                      <div className="flex flex-col items-center">
                        {singleOrderInAccountant?.assignedWarehouse?.name}
                        <span className="text-xs font-normal text-gray-600">
                          (
                          {singleOrderInAccountant?.assignedWarehouse?.location}
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

      {/* Open Invoice Modal */}
      {openInvoice && (
        <div className="transition-all bg-black/30 backdrop-blur-sm w-full z-50 h-screen absolute top-0 left-0 flex items-center justify-center">
          <div className="bg-white relative p-7 rounded-lg w-[35%] overflow-auto">
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
                  {singleOrderInAccountant?.invoiceDetails?.invoicedBy?.name}
                </div>
                <div className="flex items-center justify-between font-semibold">
                  <span className="text-gray-600 font-normal">Email:</span>
                  {singleOrderInAccountant?.invoiceDetails?.invoicedBy?.email}
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
                  {singleOrderInAccountant?.party?.companyName}
                </div>
                <div className="flex items-center justify-between font-semibold">
                  <span className="text-gray-600 font-normal">Address:</span>
                  {singleOrderInAccountant?.party?.address}
                </div>
                <div className="flex items-center justify-between font-semibold">
                  <span className="text-gray-600 font-normal">
                    Contact Person Number:
                  </span>
                  {singleOrderInAccountant?.party?.contactPersonNumber}
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
                    singleOrderInAccountant?.invoiceDetails?.totalAmount
                  )}
                </div>
                <div className="flex items-center justify-between font-semibold text-green-700">
                  <span className="text-gray-600 font-normal">
                    Advance Amount:
                  </span>
                  {formatRupee(
                    singleOrderInAccountant?.invoiceDetails?.advanceAmount
                  )}
                </div>
                <div className="flex items-center justify-between font-semibold text-red-700">
                  <span className="text-gray-600 font-normal">Due Amount:</span>
                  {formatRupee(
                    singleOrderInAccountant?.invoiceDetails?.dueAmount
                  )}
                </div>
                <div className="flex items-center justify-between font-semibold">
                  <span className="text-gray-600 font-normal">Due Date:</span>
                  {format(
                    singleOrderInAccountant?.invoiceDetails?.dueDate,
                    "dd MMM yyyy"
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersForAccountant;
