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
import { DownloadIcon, Eye, File } from "lucide-react";
import { format } from "date-fns";
import { DataGrid } from "@mui/x-data-grid";
import CloseIcon from "@mui/icons-material/Close";
import { formatRupee } from "../../../utils/formatRupee.js";
import { useSalesmanOrder } from "../../../hooks/useSalesmanOrder.js";
import { CgCreditCard } from "react-icons/cg";
import { Controller, useForm } from "react-hook-form";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { MdOutlineCancel } from "react-icons/md";
import { PackageCheck } from "lucide-react";
import { FileClock } from "lucide-react";
import { useUser } from "../../../hooks/useUser.js";

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
  paymentMode,
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
    paymentMode: paymentMode,
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
    head: [
      [
        "Total Amount",
        "Advance Amount",
        "Due Amount",
        "Due Date",
        "Payment Mode",
      ],
    ],
    body: [
      [
        `${formatRupee(paymentInfo.total)}`,
        `${formatRupee(paymentInfo.advance)}`,
        `${formatRupee(paymentInfo.due)}`,
        paymentInfo.dueDate,
        paymentInfo.paymentMode,
      ],
    ],
  });

  // Save file
  doc.save("invoice.pdf");
};

const AllOrdersForSalesman = () => {
  const [singleOrderId, setSingleOrderId] = useState(null);
  const [openView, setOpenView] = useState(false);
  const [openInvoice, setOpenInvoice] = useState(false);
  const [openDuePaymentInvoice, setOpenDuePaymentInvoice] = useState(false);
  const [openDeliver, setOpenDeliver] = useState(false);
  const [openUpdatePayment, setOpenUpdatePayment] = useState(false);
  const [openCancel, setOpenCancel] = useState(false);

  const { user } = useUser();

  const {
    updatePayment,
    singleOrderFromSalesman,
    singleOrderLoading,
    ordersInSalesman,
    ordersInSalesmanLoading,
    isUpdatingPayment,
    cancelOrder,
    deliverOrder,
    isDeliveringOrder,
    isCancelingOrder,
  } = useSalesmanOrder(singleOrderId);

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setValue,
    watch,
  } = useForm();

  const reason = watch("reason");

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 5,
  });

  const handleView = (id) => {
    setSingleOrderId(id);
    setOpenView(true);
    refetchSingleOrder();
  };

  const handleOpenInvoice = (id) => {
    setSingleOrderId(id);
    setOpenInvoice(true);
  };

  const handleOpenDuePaymentInvoice = (id) => {
    setSingleOrderId(id);
    setOpenDuePaymentInvoice(true);
  };

  const handleCancelOrder = (data) => {
    data.orderId = singleOrderId;
    cancelOrder(data);
    setOpenCancel(false);
  };

  const handleDeliverOrder = () => {
    deliverOrder(singleOrderId, { onSuccess: () => setOpenDeliver(false) });
  };

  const dueAmountDocs = watch("dueAmountDocs");
  const dueAmountDocsFile = dueAmountDocs ? dueAmountDocs[0] : null;

  const handleUpdatePayment = (data) => {
    data.orderId = singleOrderId;

    const formData = new FormData();
    formData.append("orderId", singleOrderId);
    formData.append("amount", data.amount);
    formData.append("paymentMode", data.paymentMode);
    formData.append("dueAmountDocs", dueAmountDocsFile);
    updatePayment(formData, { onSuccess: () => setOpenUpdatePayment(false) });
    setValue("amount", "");
    setValue("paymentMode", "");
  };

  const handleDownloadDueInvoice = () => {
    downloadInvoice({
      accName: singleOrderFromSalesman?.dueInvoiceDetails?.invoicedBy?.name,
      accEmail: singleOrderFromSalesman?.dueInvoiceDetails?.invoicedBy?.email,
      partyName: singleOrderFromSalesman?.dueInvoiceDetails?.party?.companyName,
      partyAddress: singleOrderFromSalesman?.dueInvoiceDetails?.party?.address,
      partyContact:
        singleOrderFromSalesman?.dueInvoiceDetails?.party?.contactPersonNumber,
      totalAmount: singleOrderFromSalesman?.dueInvoiceDetails?.totalAmount,
      advanceAmount: singleOrderFromSalesman?.dueInvoiceDetails?.advanceAmount,
      dueAmount: singleOrderFromSalesman?.dueInvoiceDetails?.dueAmount,
      dueDate: format(
        singleOrderFromSalesman?.dueInvoiceDetails?.dueDate,
        "dd MMM yyyy"
      ),
      paymentMode: singleOrderFromSalesman?.dueInvoiceDetails?.paymentMode,
    });
  };

  const handleDownloadInvoice = () => {
    downloadInvoice({
      accName: singleOrderFromSalesman?.invoiceDetails?.invoicedBy?.name,
      accEmail: singleOrderFromSalesman?.invoiceDetails?.invoicedBy?.email,
      partyName: singleOrderFromSalesman?.party?.companyName,
      partyAddress: singleOrderFromSalesman?.party?.address,
      partyContact: singleOrderFromSalesman?.party?.contactPersonNumber,
      totalAmount: singleOrderFromSalesman?.totalAmount,
      advanceAmount: singleOrderFromSalesman?.advanceAmount,
      dueAmount: singleOrderFromSalesman?.dueAmount,
      dueDate: format(singleOrderFromSalesman?.dueDate, "dd MMM yyyy"),
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
    {
      field: "product",
      headerName: "Product",
      flex: 1,
      renderCell: (params) => {
        return (
          <div className="relative flex items-center">
            <span>{params.value}</span>
            <span className="absolute right-0 bg-gray-500 text-xs text-white h-5 w-5 rounded-full flex items-center justify-center">
              {params.row.numProducts}
            </span>
          </div>
        );
      },
    },
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
          <Tooltip title="View Order Details" placement="left">
            <Eye
              color="blue"
              className="hover:bg-blue-200 active:scale-95 transition-all p-1.5 rounded-lg"
              size={30}
              onClick={() => handleView(params.row.id)}
            />
          </Tooltip>

          {params.row.paymentStatus !== "Paid" && (
            <Tooltip title="Update Payment" placement="top">
              <CgCreditCard
                color="purple"
                className="hover:bg-purple-200 active:scale-95 transition-all p-1.5 rounded-lg"
                size={30}
                onClick={() => {
                  setSingleOrderId(params.row.id);
                  setOpenUpdatePayment(true);
                }}
              />
            </Tooltip>
          )}

          {params.row.invoiceGenerated && (
            <Tooltip title="View invoice" placement="top">
              <File
                strokeWidth={2.1}
                color="teal"
                className="hover:bg-teal-200 active:scale-95 transition-all p-1.5 rounded-lg"
                size={30}
                onClick={() => handleOpenInvoice(params.row.id)}
              />
            </Tooltip>
          )}

          {params.row.dueInvoiceGenerated && (
            <Tooltip title="View due payment invoice" placement="top">
              <FileClock
                strokeWidth={2.1}
                color="teal"
                className="hover:bg-teal-200 active:scale-95 transition-all p-1.5 rounded-lg"
                size={30}
                onClick={() => handleOpenDuePaymentInvoice(params.row.id)}
              />
            </Tooltip>
          )}

          {params.row.orderStatus === "Placed" && (
            <>
              {user.isActive ? (
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
              ) : (
                <MdOutlineCancel
                  color="gray"
                  className="p-1.5 rounded-lg cursor-not-allowed"
                  size={30}
                />
              )}
            </>
          )}

          {params.row.orderStatus === "Dispatched" &&
            params.row.invoiceGenerated && (
              <Tooltip title="Mark as Delivered" placement="top">
                <PackageCheck
                  color="green"
                  className="hover:bg-green-200 active:scale-95 transition-all p-1.5 rounded-lg"
                  size={30}
                  onClick={() => {
                    setSingleOrderId(params.row.id);
                    setOpenDeliver(true);
                  }}
                />
              </Tooltip>
            )}
        </div>
      ),
    },
  ];

  const rows = ordersInSalesman?.map((order) => ({
    id: order._id,
    orderId: `#${order.orderId}`,
    party: order?.party?.companyName,
    date: format(order?.createdAt, "dd MMM yyyy"),
    product: order?.items?.map((p) => p.product?.name).join(", "),
    quantity: order?.items?.map((p) => `${p.quantity} bags`).join(", "),
    totalAmount: formatRupee(order.totalAmount),
    advanceAmount: formatRupee(order.advanceAmount),
    dueAmount: formatRupee(order.dueAmount),
    invoiceGenerated: order.invoiceGenerated,
    dueInvoiceGenerated: order.dueInvoiceGenerated,
    paymentStatus: order.paymentStatus,
    orderStatus: order.orderStatus,
    numProducts: order.items.length,
  }));

  if (ordersInSalesmanLoading || singleOrderLoading)
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
          <div className="bg-white relative p-7 rounded-lg max-w-[50%] min-w-[45%] max-h-[95%] overflow-auto">
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
                  {singleOrderFromSalesman?.items?.map((item) => (
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

            <div className="grid grid-cols-2 gap-7">
              <div className="flex flex-col gap-5">
                <div className="flex flex-col gap-2 text-sm">
                  <h1 className="font-semibold text-base text-gray-800">
                    Order Information
                  </h1>
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
                    {format(singleOrderFromSalesman?.createdAt, "dd MMM yyyy")}
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
                    ) : singleOrderFromSalesman?.orderStatus === "Cancelled" ? (
                      <span className="text-red-700 bg-red-100 p-1 px-3 rounded-full text-xs">
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
                    {singleOrderFromSalesman?.paymentStatus ===
                      "PendingDues" && (
                      <span className="text-red-700 bg-red-100 p-1 px-3 rounded-full text-xs">
                        Pending Dues
                      </span>
                    )}
                    {singleOrderFromSalesman?.paymentStatus === "Paid" && (
                      <span className="text-green-700 bg-green-100 p-1 px-3 rounded-full text-xs">
                        Paid
                      </span>
                    )}
                    {singleOrderFromSalesman?.paymentStatus ===
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
              </div>
            </div>
            {singleOrderFromSalesman?.assignedWarehouse && (
              <div className="flex flex-col text-sm my-5">
                <h1 className="font-semibold text-base text-gray-800">
                  Assigned Warehouse
                </h1>
                <div className="flex items-center justify-between font-semibold">
                  <span className="text-gray-600 font-normal">Warehouse:</span>
                  {singleOrderFromSalesman?.assignedWarehouse ? (
                    <div className="flex items-center">
                      <p>{singleOrderFromSalesman?.assignedWarehouse?.name}</p>
                      &nbsp;
                      <p className="text-xs font-normal text-gray-600">
                        ({singleOrderFromSalesman?.assignedWarehouse?.location})
                      </p>
                    </div>
                  ) : (
                    <span className="text-red-700 bg-red-100 p-1 px-3 rounded-full text-xs">
                      Not Assigned
                    </span>
                  )}
                </div>
              </div>
            )}

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
                      </span>{" "}
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
                  Invoiced By
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
                  {singleOrderFromSalesman?.invoiceDetails?.party?.companyName}
                </div>
                <div className="flex items-center justify-between font-semibold">
                  <span className="text-gray-600 font-normal">Address:</span>
                  {singleOrderFromSalesman?.invoiceDetails?.party?.address}
                </div>
                <div className="flex items-center justify-between font-semibold">
                  <span className="text-gray-600 font-normal">
                    Contact Person Number:
                  </span>
                  {
                    singleOrderFromSalesman?.invoiceDetails?.party
                      ?.contactPersonNumber
                  }
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
              <hr className="my-3" />
              <div>
                <div className="flex items-center justify-between font-semibold text-sm">
                  <span className="text-gray-600 font-normal">
                    Invoice Generated on:
                  </span>
                  {format(
                    singleOrderFromSalesman?.invoiceDetails?.generatedAt,
                    "dd MMM yyyy"
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- View Invoice Modal --- */}
      {openDuePaymentInvoice && (
        <div className="transition-all bg-black/30 backdrop-blur-sm w-full z-50 h-screen absolute top-0 left-0 flex items-center justify-center">
          <div className="bg-white relative p-7 w-[35%] rounded-lg overflow-auto">
            <div className="mb-5">
              <div className="flex items-center justify-between">
                <p className="text-xl font-bold">Due Payment Invoice</p>
                <div className="flex items-center gap-5">
                  <div className="relative group">
                    {user.isActive ? (
                      <Tooltip
                        title="Download Invoice"
                        placement="top"
                        enterDelay={500}
                      >
                        <DownloadIcon
                          onClick={handleDownloadDueInvoice}
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
                    onClick={() => setOpenDuePaymentInvoice(false)}
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
                  {singleOrderFromSalesman?.dueInvoiceDetails?.invoicedBy?.name}
                </div>
                <div className="flex items-center justify-between font-semibold">
                  <span className="text-gray-600 font-normal">Email:</span>
                  {
                    singleOrderFromSalesman?.dueInvoiceDetails?.invoicedBy
                      ?.email
                  }
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
                  {
                    singleOrderFromSalesman?.dueInvoiceDetails?.party
                      ?.companyName
                  }
                </div>
                <div className="flex items-center justify-between font-semibold">
                  <span className="text-gray-600 font-normal">Address:</span>
                  {singleOrderFromSalesman?.dueInvoiceDetails?.party?.address}
                </div>
                <div className="flex items-center justify-between font-semibold">
                  <span className="text-gray-600 font-normal">
                    Contact Person Number:
                  </span>
                  {
                    singleOrderFromSalesman?.dueInvoiceDetails?.party
                      ?.contactPersonNumber
                  }
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
                    singleOrderFromSalesman?.dueInvoiceDetails?.totalAmount
                  )}
                </div>
                <div className="flex items-center justify-between font-semibold text-green-700">
                  <span className="text-gray-600 font-normal">
                    Advance Amount:
                  </span>
                  {formatRupee(
                    singleOrderFromSalesman?.dueInvoiceDetails?.advanceAmount
                  )}
                </div>
                <div className="flex items-center justify-between font-semibold text-red-700">
                  <span className="text-gray-600 font-normal">Due Amount:</span>
                  {formatRupee(
                    singleOrderFromSalesman?.dueInvoiceDetails?.dueAmount
                  )}
                </div>
                <div className="flex items-center justify-between font-semibold">
                  <span className="text-gray-600 font-normal">Due Date:</span>
                  {format(
                    singleOrderFromSalesman?.dueInvoiceDetails?.dueDate,
                    "dd MMM yyyy"
                  )}
                </div>
                <div className="flex items-center justify-between font-semibold">
                  <span className="text-gray-600 font-normal">
                    Payment Mode:
                  </span>
                  {singleOrderFromSalesman?.dueInvoiceDetails?.paymentMode}
                </div>
              </div>
              <hr className="my-3" />
              <div>
                <div className="flex items-center justify-between font-semibold text-sm">
                  <span className="text-gray-600 font-normal">
                    Invoice Generated on:
                  </span>
                  {format(
                    singleOrderFromSalesman?.dueInvoiceDetails?.generatedAt,
                    "dd MMM yyyy"
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Deliver Order Modal */}
      {openDeliver && (
        <div className="transition-all bg-black/30 backdrop-blur-sm w-full z-50 h-screen absolute top-0 left-0 flex items-center justify-center">
          <div className="bg-white p-7 rounded-lg w-[35rem]">
            <p className="text-lg font-semibold">
              Are you sure you want to mark this order Delivered?
            </p>
            <p className="text-gray-500 text-sm">
              This action cannot be undone.{" "}
              {singleOrderFromSalesman?.item?.name} will be marked as Delivered.
            </p>
            <div className="flex items-center justify-end gap-3 mt-5">
              <Button
                variant="outlined"
                disableElevation
                color="error"
                sx={{ textTransform: "none" }}
                onClick={() => setOpenDeliver(false)}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                disableElevation
                color="error"
                sx={{ textTransform: "none" }}
                onClick={handleDeliverOrder}
                loading={isDeliveringOrder}
              >
                Deliver Order
              </Button>
            </div>
          </div>
        </div>
      )}

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
                <div>
                  <span className="text-sm mb-1 ms-3 text-gray-600">
                    Upload Due Payment Proof
                  </span>
                  <input
                    // disabled={singleOrderFromPlanthead?.dueAmount > 0}
                    className="relative mt-1 block w-full min-w-0 flex-auto rounded border border-solid border-neutral-300 bg-clip-padding px-3 py-[0.32rem] text-base font-normal text-neutral-700 transition duration-300 ease-in-out file:-mx-3 file:-my-[0.32rem] file:overflow-hidden file:rounded-none file:border-0 file:border-solid file:border-inherit file:bg-neutral-100 file:px-3 file:py-[0.32rem] file:text-neutral-700 file:transition file:duration-150 file:ease-in-out file:[border-inline-end-width:1px] file:[margin-inline-end:0.75rem] hover:file:bg-neutral-200 focus:border-primary focus:text-neutral-700 focus:shadow-te-primary focus:outline-none "
                    type="file"
                    id="formFileMultiple"
                    multiple
                    {...register("dueAmountDocs", {
                      required: {
                        value: true,
                        message: "Due Payment Proof is required",
                      },
                    })}
                  />
                  {errors.dueAmountDocs && (
                    <p className="text-red-600 text-xs mt-1">
                      {errors.dueAmountDocs.message}
                    </p>
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
                    loading={isUpdatingPayment}
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
                  loading={isCancelingOrder}
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

export default AllOrdersForSalesman;
