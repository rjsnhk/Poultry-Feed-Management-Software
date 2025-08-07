import { useState } from "react";
import { CircularProgress, IconButton } from "@mui/material";
import { Eye, Mail, Phone, SquarePen, Trash2, User } from "lucide-react";
import { useOrder } from "../../../hooks/useOrders";
import { format } from "date-fns";
import { DataGrid } from "@mui/x-data-grid";
import CloseIcon from "@mui/icons-material/Close";

const OrdersTable = () => {
  const [singleOrderId, setSingleOrderId] = useState(null);
  const [openView, setOpenView] = useState(false);
  const { orders, singleOrder, ordersLoading } = useOrder(singleOrderId);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 5,
  });

  console.log(orders);
  console.log(singleOrder);

  const handleView = (id) => {
    console.log(id);
    setSingleOrderId(id);
    setOpenView(true);
  };

  const handleUpdate = (id) => {
    console.log(id);
  };

  const handleDelete = (id) => {
    console.log(id);
  };

  const columns = [
    { field: "product", headerName: "Product", flex: 1, maxWidth: 150 },
    { field: "placedBy", headerName: "Placed By", flex: 1, maxWidth: 150 },
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
              ? "text-red-600 bg-red-100 p-1 px-3 rounded-full"
              : params.value === "Delivered"
              ? "text-green-600 bg-green-100 p-1 px-3 rounded-full"
              : "text-blue-600 bg-blue-100 p-1 px-3 rounded-full"
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
          <Trash2
            color="red"
            className="hover:bg-red-100 active:scale-95 transition-all p-1.5 rounded-lg"
            size={30}
            onClick={() => handleDelete(params.row.id)}
          />
        </div>
      ),
    },
  ];

  const rows = orders?.map((order) => ({
    id: order._id,
    placedBy: order?.placedBy?.name,
    date: format(order?.createdAt, "dd MMM yyyy"),
    product: order.item,
    quantity: `${order.quantity}kg`,
    totalAmount: `₹${order.totalAmount}`,
    advanceAmount: `₹${order.advanceAmount}`,
    dueAmount: `₹${order.dueAmount}`,
    orderStatus: order.orderStatus,
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
            maxWidth: "1210px",
          },
        }}
        disableColumnResize={false}
      />

      {/* --- View Order Modal --- */}
      {openView && (
        <div className="transition-all bg-black/30 backdrop-blur-sm w-full z-50 h-screen absolute top-0 left-0 flex items-center justify-center">
          <div className="bg-white relative p-7 rounded-lg w-[70%] h-[70%] overflow-auto">
            <div>
              <div className="flex items-center justify-between">
                <p className="text-xl font-semibold">Order Details</p>
                <IconButton size="small" onClick={() => setOpenView(false)}>
                  <CloseIcon />
                </IconButton>
              </div>
            </div>
            <div></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersTable;
