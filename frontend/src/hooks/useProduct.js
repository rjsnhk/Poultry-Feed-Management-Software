import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { API_PATHS, BASE_URL } from "../../../backend/config/apiPaths";
import { toast } from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";

export const useProduct = (warehouseId) => {
  const token = localStorage.getItem("token");
  const queryClient = useQueryClient();

  // GET Products
  const { data: products, isPending: productsLoading } = useQuery({
    queryKey: ["product", warehouseId],
    queryFn: async () => {
      const response = await axios.get(
        BASE_URL + API_PATHS.ADMIN.WAREHOUSE.GET_PRODUCTS(warehouseId),
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // console.log("products", response.data.data);
      return response.data.data;
    },
  });

  // UPDATE Product Price
  const { mutate: updateProductPrice, isPending: isUpdatingProductPrice } =
    useMutation({
      mutationFn: async (data) => {
        console.log("data in api", data);
        const response = await axios.put(
          BASE_URL +
            API_PATHS.ADMIN.WAREHOUSE.UPDATE_PRODUCT_PRICE(
              data.warehouseId,
              data.productId
            ),
          data,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        return response.data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["singleWarehouse", warehouseId],
        });
        queryClient.invalidateQueries({
          queryKey: ["product", warehouseId],
        });
        toast.success("Product price updated successfully");
      },
      onError: (error) => {
        console.log(error);
        toast.error(error.response.data.message);
      },
    });

  // ADD Product
  const { mutate: addProduct, isPending: isAddingProduct } = useMutation({
    mutationFn: async (data) => {
      console.log("data in add product", data);
      const response = await axios.post(
        BASE_URL + API_PATHS.ADMIN.WAREHOUSE.ADD_PRODUCT(data.warehouseId),
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["singleWarehouse", warehouseId],
      });
      queryClient.invalidateQueries({
        queryKey: ["product", warehouseId],
      });
      toast.success("Product added successfully");
    },
    onError: (error) => {
      console.log(error);
      toast.error(error.response.data.message);
    },
  });

  // DELETE Product
  const { mutate: deleteProduct, isPending: isDeletingProduct } = useMutation({
    mutationFn: async (data) => {
      const response = await axios.delete(
        BASE_URL +
          API_PATHS.ADMIN.WAREHOUSE.DELETE_PRODUCT(
            data.warehouseId,
            data.productId
          ),
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["singleWarehouse", warehouseId],
      });
      queryClient.invalidateQueries({
        queryKey: ["product", warehouseId],
      });
      toast.success("Product deleted successfully");
    },
    onError: (error) => {
      console.log(error);
      toast.error(error.response.data.message);
    },
  });

  const isLoading =
    productsLoading ||
    isUpdatingProductPrice ||
    isAddingProduct ||
    isDeletingProduct;

  return {
    updateProductPrice,
    addProduct,
    deleteProduct,
    products,
    isLoading,
  };
};
