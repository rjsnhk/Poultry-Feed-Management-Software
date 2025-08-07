import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { API_PATHS, BASE_URL } from "../../../backend/config/apiPaths";

export const useOrder = (id) => {
  const token = localStorage.getItem("token");

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
      return response.data.data;
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

  return { orders, ordersLoading, singleOrder, singleOrderLoading };
};
