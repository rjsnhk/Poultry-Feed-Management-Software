import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { API_PATHS, BASE_URL } from "../utils/apiPaths";
import axios from "axios";
import { toast } from "react-hot-toast";

export const useSalesmanOrder = (id) => {
  const token = localStorage.getItem("token");
  const queryClient = useQueryClient();

  // GET all orders from Salesman
  const { data: ordersInSalesman, isPending: ordersInSalesmanLoading } =
    useQuery({
      queryKey: ["ordersInSalesman"],
      queryFn: async () => {
        const response = await axios.get(
          BASE_URL + API_PATHS.SALESMAN.GET_ALL_ORDERS,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("salesman orders", response.data.data);
        return response.data.data;
      },
      onError: (error) => {
        console.log(error);
      },
    });

  // GET Due orders from Salesman
  const { data: dueOrdersInSalesman, isPending: dueOrdersInSalesmanLoading } =
    useQuery({
      queryKey: ["dueOrdersInSalesman"],
      queryFn: async () => {
        const response = await axios.get(
          BASE_URL + API_PATHS.SALESMAN.GET_DUE_ORDERS,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("salesman due orders", response.data.data);
        return response.data.data;
      },
      onError: (error) => {
        console.log(error);
      },
    });

  //GET single order using order id
  const { data: singleOrderFromSalesman, isPending: singleOrderLoading } =
    useQuery({
      queryKey: ["singleOrder", id],
      queryFn: async () => {
        if (!id) return null;
        console.log("id", id);
        const response = await axios.get(
          BASE_URL + API_PATHS.SALESMAN.GET_ORDER(id),
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("salesman single order", response.data.data);
        return response.data.data;
      },
      onError: (error) => {
        console.log(error);
      },
    });

  // CREATE Order in Salesman
  const { mutate: createOrder, isPending: isCreatingOrder } = useMutation({
    mutationFn: async (data) => {
      const response = await axios.post(
        BASE_URL + API_PATHS.SALESMAN.CREATE_ORDER,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["order"] });
      queryClient.invalidateQueries({ queryKey: ["ordersInSalesman"] });
      console.log(data);
      toast.success(data.message);
    },
    onError: (error) => {
      console.log(error);
      toast.error(error.response.data.message);
    },
  });

  // DELETE Order in Salesman
  const { mutate: deleteOrder, isPending: isDeletingOrder } = useMutation({
    mutationFn: async (orderId) => {
      const response = await axios.delete(
        BASE_URL + API_PATHS.SALESMAN.DELETE_ORDER(orderId),
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["order"] });
      queryClient.invalidateQueries({ queryKey: ["ordersInSalesman"] });
      console.log(data);
      toast.success(data.message);
    },
    onError: (error) => {
      console.log(error);
      toast.error(error.response.data.message);
    },
  });

  // update payment in Salesman
  const { mutate: updatePayment, isPending: isUpdatingPayment } = useMutation({
    mutationFn: async (data) => {
      console.log("data", data);
      const response = await axios.post(
        BASE_URL + API_PATHS.SALESMAN.UPDATE_PAYMENT(data.orderId),
        { amount: data.amount, paymentMode: data.paymentMode },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["order"] });
      queryClient.invalidateQueries({ queryKey: ["ordersInSalesman"] });
      console.log(data);
      toast.success(data.message);
    },
    onError: (error) => {
      console.log(error);
      toast.error(error.response.data.message);
    },
  });

  return {
    ordersInSalesman,
    singleOrderFromSalesman,
    dueOrdersInSalesman,
    createOrder,
    updatePayment,
    deleteOrder,

    //Loading
    ordersInSalesmanLoading,
    singleOrderLoading,
    dueOrdersInSalesmanLoading,
    isUpdatingPayment,
    isCreatingOrder,
    isDeletingOrder,
  };
};
