import React, { useState } from "react";
import { SiDecentraland } from "react-icons/si";
import { IoLocationOutline } from "react-icons/io5";
import { BadgeCheck, CircleMinus, Cross, Phone } from "lucide-react";
import {
  MdOutlineAccountBalance,
  MdOutlineManageAccounts,
} from "react-icons/md";
import { Box, Eye, Mail, SquarePen, Trash2, User } from "lucide-react";
import CloseIcon from "@mui/icons-material/Close";
import useWarehouse from "../../../hooks/useWarehouse";
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
import { Controller, useForm } from "react-hook-form";
import useEmployees from "../../../hooks/useEmployees";
import { useSingleWarehouse } from "../../../hooks/useSingleWarehouse";
import { CgDollar } from "react-icons/cg";
import { useProduct } from "../../../hooks/useProduct";
import useFilteredProducts from "../../../hooks/useFilteredProducts";

const Warehouse = ({ warehouse }) => {
  const { planthead, accountant } = useEmployees();
  const { updateWarehouse, deleteWarehouse, isLoading, approveWarehouse } =
    useWarehouse();
  const { singleWarehouse, singleWarehouseLoading } = useSingleWarehouse(
    warehouse._id
  );
  const { deleteProductFromWarehouse, addProductToWarehouse } = useProduct(
    warehouse._id
  );

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();
  const [openEdit, setOpenEdit] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openManageStock, setOpenManageStock] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedProductId, setSelectedProductId] = useState(null);

  const { filteredProducts, isPending } = useFilteredProducts(selectedCategory);

  const handleEditWarehouse = (data) => {
    data._id = warehouse._id;
    updateWarehouse(data);
    setOpenEdit(false);
  };

  const handleDeleteProduct = (productId) => {
    const data = {
      warehouseId: warehouse._id,
      productId: productId,
    };
    deleteProductFromWarehouse(data);
    setOpenDelete(false);
  };

  const handleAddProduct = (data) => {
    data.warehouseId = warehouse._id;
    data.productId = selectedProductId;
    console.log("handle add product", data);
    addProductToWarehouse(data);
  };

  if (singleWarehouseLoading || isPending) return <CircularProgress />;

  return (
    <div className="bg-white rounded-lg p-5 shadow hover:shadow-md transition-all">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-pink-100 rounded-full">
            <SiDecentraland className="text-4xl opacity-70 text-pink-600" />
          </div>
          <div>
            <p className="font-semibold text-lg">{warehouse.name}</p>
            <div className="flex items-center gap-1">
              <IoLocationOutline className="text-gray-600" />
              <p className="text-sm text-gray-600">{warehouse.location}</p>
            </div>
          </div>
        </div>
        <div>
          <div>
            {warehouse.approved ? (
              <p className="bg-green-100 p-1 px-3 rounded-full text-green-800 text-sm">
                Approved
              </p>
            ) : (
              <p className="bg-gray-100 p-1 px-3 rounded-full text-gray-800 text-sm">
                Pending
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="mt-5 space-y-2">
        <div className="text-sm text-gray-600 flex justify-between">
          <span className="flex items-center gap-1">
            <MdOutlineManageAccounts className="text-pink-600" />
            Plant Head:
          </span>
          <span className="text-black">{warehouse?.plantHead?.name}</span>
        </div>
        <div className="text-sm text-gray-600 flex justify-between">
          <span className="flex items-center gap-1">
            <MdOutlineAccountBalance className="text-green-600" />
            Accountant:
          </span>
          <span className="text-black">{warehouse?.accountant?.name}</span>
        </div>
        <div className="text-sm text-gray-600 flex justify-between">
          <span className="flex items-center gap-1">
            <Box className="text-blue-600" size={15} strokeWidth={1.5} />
            Stock items:
          </span>
          <span className="text-black">{warehouse?.stock?.length}</span>
        </div>
      </div>

      <div className="flex gap-1 mt-5">
        <button
          onClick={() => setOpenManageStock(true)}
          className="p-1 px-2 rounded-lg bg-violet-100 text-violet-800 w-full text-sm hover:bg-violet-200 active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          <Box size={15} strokeWidth={1.5} />
          Manage Products
        </button>
        <Eye
          color="blue"
          className="hover:bg-blue-100 active:scale-95 transition-all p-0.5 px-2 rounded-lg"
          size={40}
          onClick={() => setOpenView(true)}
        />
        <SquarePen
          color="green"
          className="hover:bg-green-100 active:scale-95 transition-all p-0.5 px-2 rounded-lg"
          size={40}
          onClick={() => setOpenEdit(true)}
        />
        <Trash2
          color="red"
          className="hover:bg-red-100 active:scale-95 transition-all p-0.5 px-2 rounded-lg"
          size={40}
          onClick={() => setOpenDelete(true)}
        />
      </div>

      {/* --- Edit Warehouse Modal --- */}
      {openEdit && (
        <div className="transition-all bg-black/30 backdrop-blur-sm w-full z-50 h-screen absolute top-0 left-0 flex items-center justify-center">
          <div className="bg-white p-7 rounded-lg w-[29rem]">
            <p className="text-xl font-semibold mb-7">Edit Warehouse</p>
            <form
              className="space-y-5"
              onSubmit={handleSubmit(handleEditWarehouse)}
            >
              <TextField
                size="small"
                fullWidth
                id="outlined-basic"
                label="Name"
                variant="outlined"
                defaultValue={warehouse?.name}
                {...register("name", {
                  required: { value: true, message: "Name is required" },
                })}
              />
              <TextField
                size="small"
                fullWidth
                id="outlined-basic"
                label="Location"
                variant="outlined"
                defaultValue={warehouse?.location}
                {...register("location", {
                  required: { value: true, message: "Location is required" },
                })}
              />
              <FormControl
                fullWidth
                size="small"
                error={!!errors.plantHead}
                className="mb-4"
              >
                <InputLabel id="plantHead-label">Plant Head</InputLabel>
                <Controller
                  name="plantHead"
                  control={control}
                  rules={{ required: "Plant Head is required" }}
                  defaultValue={warehouse?.plantHead?._id}
                  render={({ field }) => (
                    <Select
                      {...field}
                      labelId="plantHead-label"
                      id="plantHead"
                      label="Plant Head"
                    >
                      <MenuItem>Select Plant Head</MenuItem>
                      {planthead?.map((head) => (
                        <MenuItem key={head._id} value={head._id}>
                          {head.name}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
                {errors?.plantHead && (
                  <span className="text-red-500 text-sm mt-1">
                    {errors.plantHead.message}
                  </span>
                )}
              </FormControl>
              <FormControl
                fullWidth
                size="small"
                error={!!errors.accountant}
                className="mb-4"
              >
                <InputLabel id="acc-label">Accountant</InputLabel>
                <Controller
                  name="accountant"
                  control={control}
                  rules={{ required: "Accountant is required" }}
                  defaultValue={warehouse?.accountant?._id}
                  render={({ field }) => (
                    <Select
                      {...field}
                      labelId="acc-label"
                      id="acc"
                      label="Accountant"
                      defaultValue={warehouse.accountant.name}
                    >
                      <MenuItem>Select Accountant</MenuItem>
                      {accountant?.map((acc) => (
                        <MenuItem key={acc._id} value={acc._id}>
                          {acc.name}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
                {errors?.accountant && (
                  <span className="text-red-500 text-sm mt-1">
                    {errors.accountant.message}
                  </span>
                )}
              </FormControl>

              <div className="flex items-center justify-end gap-3 mt-5">
                <Button
                  variant="outlined"
                  disableElevation
                  sx={{ textTransform: "none" }}
                  onClick={() => setOpenEdit(false)}
                >
                  Cancel
                </Button>
                <Button
                  loading={isLoading}
                  loadingPosition="start"
                  variant="contained"
                  disableElevation
                  sx={{ textTransform: "none" }}
                  type="submit"
                >
                  Save
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- Delete Warehouse Modal --- */}
      {openDelete && (
        <div className="transition-all bg-black/30 backdrop-blur-sm w-full z-50 h-screen absolute top-0 left-0 flex items-center justify-center">
          <div className="bg-white p-7 rounded-lg w-[29rem]">
            <p className="text-lg font-semibold">
              Are you sure you want to delete {warehouse.name}?
            </p>
            <p className="text-gray-500 text-sm">
              This action cannot be undone. {warehouse.name}'s data will be
              permanently removed.
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
                onClick={() => deleteWarehouse(warehouse?._id)}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* --- View Warehouse Modal --- */}
      {openView && (
        <div className="transition-all bg-black/30 backdrop-blur-sm w-full z-50 h-screen absolute top-0 left-0 flex items-center justify-center">
          <div className="bg-white relative p-7 rounded-lg w-[90%] h-[90%] overflow-auto">
            <div>
              <div className="flex items-center justify-between">
                <p className="text-xl font-semibold">Warehouse Details</p>
                <IconButton size="small" onClick={() => setOpenView(false)}>
                  <CloseIcon />
                </IconButton>
              </div>
              <div className="grid lg:grid-cols-2 mt-5">
                <div className="pe-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-pink-100 rounded-full">
                        <SiDecentraland className="text-4xl opacity-70 text-pink-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-lg">
                          {warehouse.name}
                        </p>
                        <div className="flex items-center gap-1">
                          <IoLocationOutline className="text-gray-600" />
                          <p className="text-sm text-gray-600">
                            {warehouse.location}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div>
                      {warehouse.approved ? (
                        <p className="bg-green-100 p-1 px-3 rounded-full text-green-800 text-sm">
                          Approved
                        </p>
                      ) : (
                        <div className="flex items-center gap-3">
                          <p className="bg-gray-100 p-1 px-3 rounded-full text-gray-800 text-sm">
                            Pending
                          </p>
                          <Button
                            onClick={() => approveWarehouse(warehouse._id)}
                            color="success"
                            variant="contained"
                            size="small"
                            startIcon={<BadgeCheck size={18} />}
                            disableElevation
                            sx={{
                              textTransform: "none",
                              borderRadius: "999px",
                            }}
                          >
                            Approve
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Total Earnings */}
                  <div className="border p-3 rounded-lg flex justify-between items-center mt-5">
                    <div>
                      <p className="font-semibold mb-1">Total Earnings</p>
                      <p className="text-2xl font-semibold">
                        {singleWarehouse?.totalEarnings}
                      </p>
                    </div>
                    <div className="w-12 h-12 flex items-center justify-center bg-green-100 rounded-full">
                      <CgDollar className="text-3xl opacity-70 text-green-600" />
                    </div>
                  </div>

                  {/* Plant Head and Accountant */}
                  <div className="grid grid-cols-2 gap-5 mt-5">
                    <div className="bg-white border rounded-lg p-3">
                      <h3 className="font-semibold">Plant Head</h3>

                      <div className="flex items-center my-1">
                        <User className="text-green-600 mr-2" size={20} />
                        <span className="font-medium text-sm">
                          {warehouse.plantHead.name}
                        </span>
                      </div>

                      <div className="flex items-center">
                        <Mail className="text-blue-600 mr-2" size={18} />
                        <a
                          href={`mailto:${warehouse.plantHead.email}`}
                          className="hover:underline text-sm font-medium"
                        >
                          {warehouse.plantHead.email}
                        </a>
                      </div>
                      <div className="flex items-center my-1">
                        <Phone className="text-violet-600 mr-2" size={18} />
                        <span className="font-medium text-sm">
                          {warehouse.plantHead.phone}
                        </span>
                      </div>
                    </div>
                    <div className="bg-white border rounded-lg p-3">
                      <h3 className="font-semibold">Accountant</h3>

                      <div className="flex items-center my-1">
                        <User className="text-green-600 mr-2" size={20} />
                        <span className="font-medium text-sm">
                          {warehouse.accountant.name}
                        </span>
                      </div>

                      <div className="flex items-center">
                        <Mail className="text-blue-600 mr-2" size={18} />
                        <a
                          href={`mailto:${warehouse.accountant.email}`}
                          className="hover:underline text-sm font-medium"
                        >
                          {warehouse.accountant.email}
                        </a>
                      </div>
                      <div className="flex items-center my-1">
                        <Phone className="text-violet-600 mr-2" size={18} />
                        <span className="font-medium text-sm">
                          {warehouse.accountant.phone}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Stock Items */}
                <div className="border-s border-gray-100 ps-5">
                  <div>
                    <p className="font-semibold text-base text-black">
                      Stock Items
                    </p>

                    <div className="relative h-[17rem] border overflow-auto rounded mt-2">
                      <table className="w-full text-center border-collapse">
                        <thead className="sticky top-0 bg-blue-50 text-blue-800 z-10">
                          <tr className="text-sm">
                            <th className="p-3 border-b">Product Name</th>
                            <th className="p-3 border-b">Description</th>
                            <th className="p-3 border-b">Quantity</th>
                            <th className="p-3 border-b">Price</th>
                          </tr>
                        </thead>
                        <tbody>
                          {singleWarehouse?.stock.length > 0 ? (
                            singleWarehouse?.stock.map((item, index) => (
                              <tr
                                key={index}
                                className="hover:bg-gray-50 text-sm"
                              >
                                <td className="p-3 border-b">
                                  {item.product.name}
                                </td>
                                <td className="p-3 border-b">
                                  {item.product.description}
                                </td>
                                <td className="p-3 border-b">
                                  {item.quantity}
                                </td>
                                <td className="p-3 border-b">
                                  {item.product.price}
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td
                                colSpan="4"
                                className="p-4 text-center text-sm text-gray-500"
                              >
                                No available stock
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>

              {/* Assigned Orders */}
              <div className="mt-5">
                <p className="font-semibold text-base text-black">
                  Assigned Orders
                </p>

                <div className="relative max-h-52 overflow-auto rounded mt-2 border">
                  <table className="w-full text-center border-collapse">
                    <thead className="sticky top-0 bg-violet-50 text-violet-800 z-10">
                      <tr className="text-sm">
                        <th className="p-3 border-b">Product Name</th>
                        <th className="p-3 border-b">Description</th>
                        <th className="p-3 border-b">Quantity</th>
                        <th className="p-3 border-b">Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {singleWarehouse?.assignedOrders?.length > 0 ? (
                        singleWarehouse?.assignedOrders?.map((item, index) => (
                          <tr key={index} className="hover:bg-gray-50 text-sm">
                            <td className="p-3 border-b">
                              {item.product.name}
                            </td>
                            <td className="p-3 border-b">
                              {item.product.description}
                            </td>
                            <td className="p-3 border-b">{item.quantity}</td>
                            <td className="p-3 border-b">
                              {item.product.price}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan="4"
                            className="p-4 text-center text-sm text-gray-500"
                          >
                            No assigned orders
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Dispatched Orders */}
              <div className="mt-5">
                <p className="font-semibold text-base text-black">
                  Dispatched Orders
                </p>

                <div className="relative max-h-52 overflow-auto rounded mt-2 border">
                  <table className="w-full text-center border-collapse">
                    <thead className="sticky top-0 bg-green-50 text-green-800 z-10">
                      <tr className="text-sm">
                        <th className="p-3 border-b">Product Name</th>
                        <th className="p-3 border-b">Description</th>
                        <th className="p-3 border-b">Quantity</th>
                        <th className="p-3 border-b">Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {singleWarehouse?.dispatchedOrders?.length > 0 ? (
                        singleWarehouse?.dispatchedOrders?.map(
                          (item, index) => (
                            <tr
                              key={index}
                              className="hover:bg-gray-50 text-sm"
                            >
                              <td className="p-3 border-b">
                                {item.product.name}
                              </td>
                              <td className="p-3 border-b">
                                {item.product.description}
                              </td>
                              <td className="p-3 border-b">{item.quantity}</td>
                              <td className="p-3 border-b">
                                {item.product.price}
                              </td>
                            </tr>
                          )
                        )
                      ) : (
                        <tr>
                          <td
                            colSpan="4"
                            className="p-4 text-center text-sm text-gray-500"
                          >
                            No dispatched orders
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- Manage Products Modal --- */}
      {openManageStock && (
        <div className="transition-all bg-black/30 backdrop-blur-sm w-full z-50 h-screen absolute top-0 left-0 flex items-center justify-center">
          <div className="bg-white p-7 rounded-lg w-[60rem] ">
            <div className="flex items-center justify-between">
              <p className="text-xl font-semibold">
                Product Management - {warehouse?.name}
              </p>
              <IconButton
                size="small"
                onClick={() => setOpenManageStock(false)}
              >
                <CloseIcon />
              </IconButton>
            </div>
            <div className="grid lg:grid-cols-3 gap-5 mt-2">
              <div className="col-span-2">
                <p className="font-semibold mb-3">Available Products</p>
                <div className="relative max-h-64 overflow-auto rounded mt-2">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-blue-50 sticky z-50 top-0 text-blue-800 text-center text-sm">
                        <th className="p-2">Product Name</th>
                        <th className="p-2">Category</th>
                        <th className="p-2">Quantity</th>
                        <th className="p-2">Price</th>
                        <th className="p-2">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {singleWarehouse?.stock?.length > 0 ? (
                        singleWarehouse?.stock?.map((item, index) => (
                          <tr key={index} className="text-center text-sm">
                            <td className="p-2">{item?.product?.name}</td>
                            <td className="p-2">{item?.product?.category}</td>
                            <td className="p-2">{item?.quantity} Bags</td>
                            <td className="p-2">₹{item?.product?.price}/bag</td>
                            <td className="p-2 flex items-center justify-center">
                              <Tooltip title="Remove Product" placement="right">
                                <CircleMinus
                                  color="red"
                                  className="hover:bg-red-100 active:scale-95 transition-all p-1.5 rounded-lg"
                                  size={30}
                                  onClick={() =>
                                    handleDeleteProduct(item?.product?._id)
                                  }
                                />
                              </Tooltip>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan="4"
                            className="p-4 text-center text-sm text-gray-500"
                          >
                            No available products
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-3">
                  <p className="font-semibold ">Add Products</p>
                </div>
                <div>
                  <form onSubmit={handleSubmit(handleAddProduct)}>
                    <div className="space-y-4">
                      <FormControl
                        fullWidth
                        size="small"
                        error={!!errors.category}
                        className="mb-4"
                      >
                        <InputLabel id="category-label">Category</InputLabel>
                        <Controller
                          name="category"
                          control={control}
                          rules={{ required: "Category is required" }}
                          render={({ field }) => (
                            <Select
                              {...field}
                              labelId="category-label"
                              id="category"
                              label="Category"
                              onChange={(e) => {
                                field.onChange(e);
                                setSelectedCategory(e.target.value);
                              }}
                            >
                              <MenuItem>Select Product Category</MenuItem>
                              <MenuItem value="broiler starter feed">
                                Broiler Starter Feed
                              </MenuItem>
                              <MenuItem value="broiler grower feed">
                                Broiler Grower Feed
                              </MenuItem>
                              <MenuItem value="broiler finisher feed">
                                Broiler Finisher Feed
                              </MenuItem>
                              <MenuItem value="layer starter feed">
                                Layer Starter Feed
                              </MenuItem>
                              <MenuItem value="layer grower feed">
                                Layer Grower Feed
                              </MenuItem>
                              <MenuItem value="layer finisher feed">
                                Layer Finisher Feed
                              </MenuItem>
                              <MenuItem value="layer mash">Layer Mash</MenuItem>
                              <MenuItem value="concentrates & premixes">
                                Concentrates & Premixes
                              </MenuItem>
                              <MenuItem value="supplements">
                                Supplements
                              </MenuItem>
                              <MenuItem value="additives">Additives</MenuItem>
                              <MenuItem value="grains">Grains</MenuItem>
                              <MenuItem value="protein meals">
                                Protein Meals
                              </MenuItem>
                              <MenuItem value="other">Other</MenuItem>
                            </Select>
                          )}
                        />
                        {errors?.category && (
                          <span className="text-red-500 text-xs mt-1">
                            {errors.category.message}
                          </span>
                        )}
                      </FormControl>
                      <FormControl
                        fullWidth
                        size="small"
                        error={!!errors.productId}
                        disabled={filteredProducts?.length === 0}
                        className="mb-4"
                      >
                        <InputLabel id="productId-label">
                          Product Name
                        </InputLabel>
                        <Controller
                          name="productId"
                          control={control}
                          rules={{ required: "Product Name is required" }}
                          render={({ field }) => (
                            <Select
                              {...field}
                              labelId="productId-label"
                              id="productId"
                              onChange={(e) => {
                                field.onChange(e);
                                setSelectedProductId(e.target.value);
                              }}
                              label="Product Name"
                            >
                              <MenuItem>Select Product Name</MenuItem>
                              {filteredProducts?.map((product) => (
                                <MenuItem key={product._id} value={product._id}>
                                  {product.name}
                                </MenuItem>
                              ))}
                            </Select>
                          )}
                        />
                        {errors?.productId && (
                          <span className="text-red-500 text-xs mt-1">
                            {errors.productId.message}
                          </span>
                        )}
                      </FormControl>
                      <Button
                        fullWidth
                        color="success"
                        variant="contained"
                        disableElevation
                        type="submit"
                      >
                        Add Product
                      </Button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Warehouse;
