import { useState } from "react";
import { CircularProgress, IconButton, Tooltip } from "@mui/material";
import { DownloadIcon, Eye, File } from "lucide-react";
import { format } from "date-fns";
import { DataGrid } from "@mui/x-data-grid";
import CloseIcon from "@mui/icons-material/Close";
import { formatRupee } from "../../../utils/formatRupee.js";
import { useAdminOrder } from "../../../hooks/useAdminOrders.js";
import { TbFileInvoice } from "react-icons/tb";
import autoTable from "jspdf-autotable";
import jsPDF from "jspdf";

const downloadInvoice = ({
  accName,
  accEmail,
  partyName,
  partyAddress,
  partyContact,
  totalAmount,
  advanceAmount,
  dueAmount,
  dueDate,
}) => {
  const invoiceBy = { name: accName, email: accEmail };
  const partyDetails = {
    company: partyName,
    address: partyAddress,
    contact: partyContact,
  };
  const paymentInfo = {
    total: totalAmount,
    advance: advanceAmount,
    due: dueAmount,
    dueDate: dueDate,
  };

  const doc = new jsPDF();

  // Title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.setTextColor(44, 62, 80); // dark blue
  doc.text("INVOICE", 14, 20);

  // Reset color
  doc.setTextColor(0, 0, 0);

  // Invoice By
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Invoice By:", 14, 35);
  doc.setFont("helvetica", "normal");
  doc.text(`Name: ${invoiceBy.name}`, 14, 42);
  doc.text(`Email: ${invoiceBy.email}`, 14, 49);

  // Party Details
  doc.setFont("helvetica", "bold");
  doc.text("Party Details:", 14, 65);
  doc.setFont("helvetica", "normal");
  doc.text(`Company Name: ${partyDetails.company}`, 14, 72);
  doc.text(`Address: ${partyDetails.address}`, 14, 79);
  doc.text(`Contact Person Number: ${partyDetails.contact}`, 14, 86);

  // Payment Information Table
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(231, 76, 60); // red heading
  doc.text("Payment Information:", 14, 105);

  doc.setTextColor(0, 0, 0); // reset to black
  autoTable(doc, {
    startY: 110,
    theme: "striped",
    headStyles: {
      fillColor: [52, 152, 219], // blue header background
      textColor: 255, // white text
      fontStyle: "bold",
    },
    bodyStyles: {
      fontSize: 12,
    },
    head: [["Total Amount", "Advance Amount", "Due Amount", "Due Date"]],
    body: [
      [
        `${formatRupee(paymentInfo.total)}`,
        `${formatRupee(paymentInfo.advance)}`,
        `${formatRupee(paymentInfo.due)}`,
        paymentInfo.dueDate,
      ],
    ],
  });

  // Save file
  doc.save("invoice.pdf");
};

const OrdersTable = () => {
  const [singleOrderId, setSingleOrderId] = useState(null);
  const [openView, setOpenView] = useState(false);
  const [openInvoice, setOpenInvoice] = useState(false);

  const { orders, singleOrder, ordersLoading, singleOrderLoading } =
    useAdminOrder(singleOrderId);

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 5,
  });

  const filteredOrders = orders?.filter(
    (order) => order.orderStatus === "WarehouseAssigned"
  );

  console.log("filteredOrders", filteredOrders);
  console.log("singleOrder", singleOrder);

  const handleView = (id) => {
    console.log(id);
    setSingleOrderId(id);
    setOpenView(true);
  };

  const handleOpenInvoice = (id) => {
    console.log(id);
    setSingleOrderId(id);
    setOpenInvoice(true);
  };

  const handleDownloadInvoice = () => {
    downloadInvoice({
      accName: singleOrder?.invoiceDetails?.invoicedBy?.name,
      accEmail: singleOrder?.invoiceDetails?.invoicedBy?.email,
      partyName: singleOrder?.party?.companyName,
      partyAddress: singleOrder?.party?.address,
      partyContact: singleOrder?.party?.contactPersonNumber,
      totalAmount: singleOrder?.totalAmount,
      advanceAmount: singleOrder?.advanceAmount,
      dueAmount: singleOrder?.dueAmount,
      dueDate: format(singleOrder?.dueDate, "dd MMM yyyy"),
    });
  };

  if (singleOrderLoading)
    return (
      <div className="flex items-center justify-center h-full w-full">
        <CircularProgress />
      </div>
    );

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
          <Tooltip title="View invoice" placement="top">
            {params.row.invoiceGenerated && (
              <File
                strokeWidth={2.1}
                color="teal"
                className="hover:bg-teal-200 active:scale-95 transition-all p-1.5 rounded-lg"
                size={30}
                onClick={() => handleOpenInvoice(params.row.id)}
              />
            )}
          </Tooltip>
        </div>
      ),
    },
  ];

  const rows = orders?.map((order) => ({
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

  if (ordersLoading)
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
                    {singleOrder?.item?.category}
                  </div>
                  <div className="flex items-center justify-between font-semibold">
                    <span className="text-gray-600 font-normal">
                      Product Name:
                    </span>{" "}
                    {singleOrder?.item?.name}
                  </div>
                  <div className="flex items-center justify-between font-semibold">
                    <span className="text-gray-600 font-normal">Quantity:</span>{" "}
                    {singleOrder?.quantity} kg
                  </div>
                  <div className="flex items-center justify-between font-semibold">
                    <span className="text-gray-600 font-normal">
                      Placed By:
                    </span>{" "}
                    {singleOrder?.placedBy?.name}
                  </div>
                  <div className="flex items-center justify-between font-semibold">
                    <span className="text-gray-600 font-normal">
                      Placed Date:
                    </span>{" "}
                    {format(singleOrder?.createdAt, "dd MMM yyyy")}
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
                    {formatRupee(singleOrder?.totalAmount)}
                  </div>
                  <div className="flex items-center justify-between font-semibold text-green-700">
                    <span className="text-gray-600 font-normal">
                      Advance Amount:
                    </span>{" "}
                    {formatRupee(singleOrder?.advanceAmount)}
                  </div>
                  <div className="flex items-center justify-between font-semibold text-red-700">
                    <span className="text-gray-600 font-normal">
                      Due Amount:
                    </span>{" "}
                    {formatRupee(singleOrder?.dueAmount)}
                  </div>
                  <div className="flex items-center justify-between font-semibold">
                    <span className="text-gray-600 font-normal">
                      Payment Mode:
                    </span>{" "}
                    {singleOrder?.paymentMode}
                  </div>
                  {singleOrder?.dueAmount !== 0 && (
                    <div className="flex items-center justify-between font-semibold">
                      <span className="text-gray-600 font-normal">
                        Due Date:
                      </span>{" "}
                      {format(singleOrder?.dueDate, "dd MMM yyyy")}
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
                    {singleOrder?.orderStatus === "Delivered" ? (
                      <span className="text-green-700 bg-green-100 p-1 px-3 rounded-full text-xs">
                        {singleOrder?.orderStatus}
                      </span>
                    ) : (
                      <span className="text-gray-700 bg-gray-200 p-1 px-3 rounded-full text-xs">
                        {singleOrder?.orderStatus}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between font-semibold">
                    <span className="text-gray-600 font-normal">
                      Payment Status:
                    </span>
                    {singleOrder?.paymentStatus === "Partial" && (
                      <span className="text-yellow-700 bg-yellow-100 p-1 px-3 rounded-full text-xs">
                        {singleOrder?.paymentStatus}
                      </span>
                    )}
                    {singleOrder?.paymentStatus === "Paid" && (
                      <span className="text-green-700 bg-green-100 p-1 px-3 rounded-full text-xs">
                        {singleOrder?.paymentStatus}
                      </span>
                    )}
                    {singleOrder?.paymentStatus === "Unpaid" && (
                      <span className="text-red-700 bg-red-100 p-1 px-3 rounded-full text-xs">
                        {singleOrder?.paymentStatus}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between font-semibold">
                    <span className="text-gray-600 font-normal">
                      Invoice Generated:
                    </span>{" "}
                    {singleOrder?.invoiceGenerated ? (
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
                    {singleOrder?.notes}
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
                    {format(singleOrder?.createdAt, "dd MMM yyyy")}
                  </div>
                </div>
                <div className="flex flex-col gap-2 text-sm">
                  <div className="flex justify-between items-center">
                    <h1 className="font-semibold text-base text-gray-800">
                      Assigned Warehouse
                    </h1>
                  </div>
                  <div className="flex items-center justify-between font-semibold">
                    <span className="text-gray-600 font-normal">
                      Warehouse:
                    </span>
                    {singleOrder?.assignedWarehouse ? (
                      <div className="flex flex-col items-center">
                        {singleOrder?.assignedWarehouse?.name}
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
                    {singleOrder?.approvedBy ? (
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
                <div className="flex items-center gap-5">
                  <div className="relative group">
                    <Tooltip
                      title="Download Invoice"
                      placement="top"
                      enterDelay={500}
                    >
                      <DownloadIcon
                        onClick={handleDownloadInvoice}
                        className="text-blue-600 hover:bg-blue-100 p-1.5 rounded-lg active:scale-95 transition-all"
                        size={30}
                      />
                    </Tooltip>
                  </div>

                  <IconButton
                    size="small"
                    onClick={() => setOpenInvoice(false)}
                  >
                    <CloseIcon />
                  </IconButton>
                </div>
              </div>
            </div>
            <div>
              <div className="flex flex-col gap-2 text-sm">
                <h1 className="font-semibold text-base text-gray-800">
                  Invoiced By
                </h1>
                <div className="flex items-center justify-between font-semibold">
                  <span className="text-gray-600 font-normal">Name:</span>
                  {singleOrder?.invoiceDetails?.invoicedBy?.name}
                </div>
                <div className="flex items-center justify-between font-semibold">
                  <span className="text-gray-600 font-normal">Email:</span>
                  {singleOrder?.invoiceDetails?.invoicedBy?.email}
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
                  {singleOrder?.party?.companyName}
                </div>
                <div className="flex items-center justify-between font-semibold">
                  <span className="text-gray-600 font-normal">Address:</span>
                  {singleOrder?.party?.address}
                </div>
                <div className="flex items-center justify-between font-semibold">
                  <span className="text-gray-600 font-normal">
                    Contact Person Number:
                  </span>
                  {singleOrder?.party?.contactPersonNumber}
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
                  {formatRupee(singleOrder?.invoiceDetails?.totalAmount)}
                </div>
                <div className="flex items-center justify-between font-semibold text-green-700">
                  <span className="text-gray-600 font-normal">
                    Advance Amount:
                  </span>
                  {formatRupee(singleOrder?.invoiceDetails?.advanceAmount)}
                </div>
                <div className="flex items-center justify-between font-semibold text-red-700">
                  <span className="text-gray-600 font-normal">Due Amount:</span>
                  {formatRupee(singleOrder?.invoiceDetails?.dueAmount)}
                </div>
                {singleOrder?.invoiceDetails?.dueAmount !== 0 && (
                  <div className="flex items-center justify-between font-semibold">
                    <span className="text-gray-600 font-normal">Due Date:</span>
                    {format(
                      singleOrder?.invoiceDetails?.dueDate,
                      "dd MMM yyyy"
                    )}
                  </div>
                )}
              </div>
              <hr className="my-3" />
              <div>
                <div className="flex items-center justify-between font-semibold text-sm">
                  <span className="text-gray-600 font-normal">
                    Invoice Generated on:
                  </span>
                  {format(
                    singleOrder?.invoiceDetails?.generatedAt,
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

export default OrdersTable;
