import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { API_PATHS, BASE_URL } from "../utils/apiPaths";
import { toast } from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";

export const useAdminOrder = (id) => {
  const token = localStorage.getItem("token");
  const queryClient = useQueryClient();

  // GET all orders
  const { data: orders, isPending: ordersLoading } = useQuery({
    queryKey: ["order"],
    queryFn: async () => {
      const response = await axios.get(
        BASE_URL + API_PATHS.ADMIN.ORDERS.GET_ALL,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("orders", response.data.data);
      return response.data.data;
    },
    onError: (error) => {
      console.log(error);
    },
  });

  // GET order by id
  const { data: singleOrder, isPending: singleOrderLoading } = useQuery({
    queryKey: ["order", id],
    queryFn: async () => {
      if (!id) return null;
      const response = await axios.get(
        BASE_URL + API_PATHS.ADMIN.ORDERS.GET(id),
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data.data;
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const { mutate: approveWarehouse, isPending: isApprovingWarehouse } =
    useMutation({
      mutationFn: async (orderId) => {
        const response = await axios.post(
          BASE_URL + API_PATHS.ADMIN.ORDERS.APPROVE,
          { orderId },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        return response.data.data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["order"] });
        toast.success("Order approved successfully");
      },
      onError: (error) => {
        console.log(error);
        toast.error(error.response.data.message);
      },
    });

  return {
    orders,
    singleOrder,
    ordersLoading,
    singleOrderLoading,
    approveWarehouse,
    isApprovingWarehouse,
  };
};
