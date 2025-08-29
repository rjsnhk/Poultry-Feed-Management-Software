import React, { useState } from "react";
import {
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { Controller, useForm } from "react-hook-form";
import { useProduct } from "../../hooks/useProduct";
import Product from "../../components/Admin/ProductManagement/Product";

const ProductManagementPage = () => {
  const [openForm, setOpenForm] = useState(false);
  const { addProduct, isLoading, allProducts } = useProduct();
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm();

  const onSubmit = (data) => {
    console.log(data);
    addProduct(data);
    setOpenForm(false);
  };

  console.log("allProducts", allProducts);

  if (isLoading) return <CircularProgress />;

  return (
    <div>
      <div className="lg:flex lg:justify-between lg:items-center mb-5">
        <h1 className="lg:text-3xl lg:font-bold">Product Management</h1>
        <Button
          size="small"
          variant="contained"
          disableElevation
          sx={{
            fontWeight: "600",
          }}
          startIcon={<AddIcon />}
          onClick={() => setOpenForm(true)}
        >
          Add Product
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 lg:gap-5">
        {allProducts?.map((product) => (
          <Product key={product._id} product={product} />
        ))}
      </div>

      {/* Add Product Modal */}
      {openForm && (
        <div className="transition-all bg-black/30 backdrop-blur-sm w-full z-50 h-screen absolute top-0 left-0 flex items-center justify-center">
          <div className="bg-white p-7 rounded-lg w-[29rem]">
            <p className="text-lg font-semibold mb-5">Add Product</p>
            <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
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
                      <MenuItem value="supplements">Supplements</MenuItem>
                      <MenuItem value="additives">Additives</MenuItem>
                      <MenuItem value="grains">Grains</MenuItem>
                      <MenuItem value="protein meals">Protein Meals</MenuItem>
                      <MenuItem value="other">Other</MenuItem>
                    </Select>
                  )}
                />
                {errors?.category && (
                  <span className="text-red-500 text-sm mt-1">
                    {errors.category.message}
                  </span>
                )}
              </FormControl>
              <TextField
                size="small"
                fullWidth
                id="outlined-basic"
                label="Product Name"
                variant="outlined"
                {...register("name", {
                  required: {
                    value: true,
                    message: "Product Name is required",
                  },
                })}
              />
              <TextField
                size="small"
                fullWidth
                id="outlined-basic"
                label="Description"
                variant="outlined"
                {...register("description", {
                  required: {
                    value: true,
                    message: "Description is required",
                  },
                })}
              />
              <TextField
                size="small"
                fullWidth
                id="outlined-basic"
                label="Price per bag"
                variant="outlined"
                {...register("price", {
                  required: {
                    value: true,
                    message: "Price is required",
                  },
                })}
              />
              <div className="flex items-center justify-end gap-3 mt-5">
                <Button
                  variant="outlined"
                  disableElevation
                  sx={{ textTransform: "none" }}
                  onClick={() => setOpenForm(false)}
                >
                  Cancel
                </Button>
                <Button
                  // loading={isLoading}
                  variant="contained"
                  disableElevation
                  sx={{ textTransform: "none" }}
                  type="submit"
                >
                  Add
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductManagementPage;
