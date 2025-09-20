import { useState } from "react";
import { Button, CircularProgress, IconButton, Tooltip } from "@mui/material";
import {
  Download,
  DownloadIcon,
  Eye,
  File,
  FileBox,
  SquarePen,
  Trash2,
} from "lucide-react";
import { format } from "date-fns";
import { DataGrid } from "@mui/x-data-grid";
import CloseIcon from "@mui/icons-material/Close";
import { formatRupee } from "../../utils/formatRupee.js";
import { useAccountantOrder } from "../../hooks/useAccountant.js";
import { useUser } from "../../hooks/useUser.js";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { downloadFile } from "../../utils/downloadFile.js";

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

const OrdersForAccountant = () => {
  const [singleOrderId, setSingleOrderId] = useState(null);
  const [openView, setOpenView] = useState(false);
  const [openInvoice, setOpenInvoice] = useState(false);
  const [openDispatchDocs, setOpenDispatchDocs] = useState(false);

  const { user } = useUser();

  const {
    ordersInAccountant,
    generateInvoice,
    ordersInAccountantLoading,
    singleOrderInAccountant,
    singleOrderInAccountantLoading,
    isGettingInvoice,
  } = useAccountantOrder(singleOrderId);

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 5,
  });

  const handleView = (id) => {
    setSingleOrderId(id);
    setOpenView(true);
  };

  const handleGetInvoice = (id) => {
    setSingleOrderId(id);
    setOpenInvoice(true);
  };

  const handleInvoiceGeneration = () => {
    const data = {
      orderId: singleOrderId,
      dueDate: format(singleOrderInAccountant?.dueDate, "yyyy-MM-dd"),
    };
    generateInvoice(data);
  };

  const handleDownloadInvoice = () => {
    downloadInvoice({
      accName: singleOrderInAccountant?.invoiceDetails?.invoicedBy?.name,
      accEmail: singleOrderInAccountant?.invoiceDetails?.invoicedBy?.email,
      partyName: singleOrderInAccountant?.party?.companyName,
      partyAddress: singleOrderInAccountant?.party?.address,
      partyContact: singleOrderInAccountant?.party?.contactPersonNumber,
      totalAmount: singleOrderInAccountant?.totalAmount,
      advanceAmount: singleOrderInAccountant?.advanceAmount,
      dueAmount: singleOrderInAccountant?.dueAmount,
      dueDate: format(singleOrderInAccountant?.dueDate, "dd MMM yyyy"),
    });
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
          {params.row.dispatchDocs && (
            <Tooltip
              title="View dispatch docs"
              enterDelay={500}
              placement="top"
            >
              <FileBox
                strokeWidth={2.1}
                color="green"
                className="hover:bg-green-200 active:scale-95 transition-all p-1.5 rounded-lg"
                size={30}
                onClick={() => {
                  setSingleOrderId(params.row.id);
                  setOpenDispatchDocs(true);
                }}
              />
            </Tooltip>
          )}
          {params.row.invoiceGenerated === true && (
            <Tooltip title="View invoice" enterDelay={500} placement="top">
              <File
                strokeWidth={2.1}
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
    dispatchDocs: order.dispatchInfo.dispatchDocs,
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
                <div>
                  {!singleOrderInAccountant?.invoiceGenerated && (
                    <Button
                      onClick={handleInvoiceGeneration}
                      sx={{
                        textTransform: "none",
                      }}
                    >
                      Generate Invoice
                    </Button>
                  )}
                </div>
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

            {/* notes */}
            <div className="flex flex-col gap-2 text-sm mt-5">
              <h1 className="font-semibold text-base text-gray-800">Notes</h1>
              <div className="bg-yellow-50 rounded-lg p-3 w-full">
                <p className="break-words whitespace-normal">
                  {singleOrderInAccountant?.notes}
                </p>
              </div>
            </div>

            {/* dispatch info */}
            {singleOrderInAccountant?.dispatchInfo && (
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
                      {singleOrderInAccountant?.dispatchInfo?.driverName}
                    </div>
                    <div className="flex items-center justify-between font-semibold">
                      <span className="text-gray-600 font-normal">
                        Driver Contact
                      </span>
                      {singleOrderInAccountant?.dispatchInfo?.driverContact}
                    </div>
                    <div className="flex items-center justify-between font-semibold">
                      <span className="text-gray-600 font-normal">
                        Transport Company:
                      </span>
                      {singleOrderInAccountant?.dispatchInfo?.transportCompany}
                    </div>
                    <div className="flex items-center justify-between font-semibold">
                      <span className="text-gray-600 font-normal">
                        Vehicle Number:
                      </span>
                      {singleOrderInAccountant?.dispatchInfo?.vehicleNumber}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 text-sm">
                    <div className="flex items-center justify-between font-semibold">
                      <span className="text-gray-600 font-normal">
                        Dispatched By:
                      </span>
                      {
                        singleOrderInAccountant?.dispatchInfo?.dispatchedBy
                          ?.name
                      }
                    </div>
                    <div className="flex items-center justify-between font-semibold">
                      <span className="text-gray-600 font-normal">
                        Plant Head Contact:
                      </span>
                      {
                        singleOrderInAccountant?.dispatchInfo?.dispatchedBy
                          ?.phone
                      }
                    </div>
                    <div className="flex items-center justify-between font-semibold">
                      <span className="text-gray-600 font-normal">
                        Dispatched Date:
                      </span>
                      {format(
                        singleOrderInAccountant?.dispatchInfo?.dispatchDate,
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

      {/* Open Invoice Modal */}
      {openInvoice && (
        <div className="transition-all bg-black/30 backdrop-blur-sm w-full z-50 h-screen absolute top-0 left-0 flex items-center justify-center">
          <div className="bg-white relative p-7 rounded-lg w-[35%] overflow-auto">
            <div className="mb-5">
              <div className="flex items-center justify-between">
                <p className="text-xl font-bold">Invoice</p>
                <div className="flex items-center gap-5">
                  <div className="relative group">
                    {user.isActive ? (
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
                    ) : (
                      <DownloadIcon
                        className="text-gray-400 cursor-not-allowed p-1.5 rounded-lg"
                        size={30}
                      />
                    )}
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
                {singleOrderInAccountant?.dueAmount !== 0 && (
                  <div className="flex items-center justify-between font-semibold">
                    <span className="text-gray-600 font-normal">Due Date:</span>
                    {format(
                      singleOrderInAccountant?.invoiceDetails?.dueDate,
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
                    singleOrderInAccountant?.invoiceDetails?.generatedAt,
                    "dd MMM yyyy"
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Open Dispatch Docs Modal */}
      {openDispatchDocs && (
        <div className="transition-all bg-black/30 backdrop-blur-sm w-full z-50 h-screen absolute top-0 left-0 flex items-center justify-center">
          <div className="bg-white relative p-7 rounded-lg max-w-[60%] min-w-[35%] max-h-[90%] overflow-auto">
            <div className="mb-5">
              <div className="flex items-center justify-between">
                <p className="text-xl font-bold">Dispatch Details</p>
                <div className="flex items-center gap-5">
                  <Tooltip
                    title="Download Dispatch Docs"
                    enterDelay={500}
                    placement="top"
                  >
                    <Download
                      color="blue"
                      className="hover:bg-blue-200 active:scale-95 transition-all p-1.5 rounded-lg"
                      size={30}
                      onClick={() =>
                        downloadFile(
                          singleOrderInAccountant?.dispatchInfo?.dispatchDocs,
                          "dispatch-docs"
                        )
                      }
                    />
                  </Tooltip>
                  <IconButton
                    size="small"
                    onClick={() => setOpenDispatchDocs(false)}
                  >
                    <CloseIcon />
                  </IconButton>
                </div>
              </div>
            </div>

            <div className="rounded-lg shadow mb-5">
              {singleOrderInAccountant?.dispatchInfo?.dispatchDocs?.endsWith(
                ".pdf"
              ) ? (
                <iframe
                  src={singleOrderInAccountant?.dispatchInfo?.dispatchDocs}
                  className="w-full h-96"
                  title="Dispatch Documents PDF"
                />
              ) : (
                <Tooltip title="Click to view invoice in new tab" followCursor>
                  <a
                    href={singleOrderInAccountant?.dispatchInfo?.dispatchDocs}
                    target="_blank"
                  >
                    {(
                      <img
                        src={
                          singleOrderInAccountant?.dispatchInfo?.dispatchDocs
                        }
                        className="w-full h-full object-contain"
                        alt="Dispatch Documents"
                      />
                    ) || (
                      <p className="p-5  text-gray-600 text-center">
                        Loading...
                      </p>
                    )}
                  </a>
                </Tooltip>
              )}
            </div>

            <div className="grid grid-cols-2 gap-7">
              <div className="flex flex-col gap-2 text-sm">
                <h1 className="font-semibold text-base text-gray-800">
                  Dispatched By
                </h1>
                <div className="flex items-center justify-between font-semibold">
                  <span className="text-gray-600 font-normal">Name:</span>
                  {singleOrderInAccountant?.dispatchInfo?.dispatchedBy?.name}
                </div>
                <div className="flex items-center justify-between font-semibold">
                  <span className="text-gray-600 font-normal">Email:</span>
                  {singleOrderInAccountant?.dispatchInfo?.dispatchedBy?.email}
                </div>
              </div>
              <div className="flex flex-col gap-2 text-sm">
                <h1 className="font-semibold text-base text-gray-800">
                  Dispatched Details:
                </h1>
                <div className="flex items-center justify-between font-semibold">
                  <span className="text-gray-600 font-normal">
                    Dispatched on:
                  </span>
                  {format(
                    singleOrderInAccountant?.dispatchInfo?.dispatchDate,
                    "dd MMM yyyy"
                  )}
                </div>
                <div className="flex items-center justify-between font-semibold">
                  <span className="text-gray-600 font-normal">
                    Transport Company:
                  </span>
                  {singleOrderInAccountant?.dispatchInfo?.transportCompany}
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
