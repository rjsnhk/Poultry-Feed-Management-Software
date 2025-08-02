import React from "react";
import { Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import Product from "../../components/Admin/ProductManagement/Product";

const ProductManagementPage = () => {
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
        >
          Add Product
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        <Product />
        <Product />
        <Product />
        <Product />
        <Product />
        <Product />
      </div>
    </div>
  );
};

export default ProductManagementPage;
