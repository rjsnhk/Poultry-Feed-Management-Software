import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { API_PATHS, BASE_URL } from "../utils/apiPaths";
import axios from "axios";
import { toast } from "react-hot-toast";

export const usePlantheadOrder = (id) => {
  const token = localStorage.getItem("token");
  const queryClient = useQueryClient();

  // GET all orders from Planthead
  const { data: ordersInPlanthead, isPending: ordersInPlantheadLoading } =
    useQuery({
      queryKey: ["ordersInPlanthead"],
      queryFn: async () => {
        const response = await axios.get(
          BASE_URL + API_PATHS.PLANT_HEAD.GET_ALL_ORDERS,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("planthead orders", response.data.data);
        return response.data.data;
      },
      onError: (error) => {
        console.log(error);
      },
    });

  // GET all products from Planthead
  const { data: productsInPlanthead, isPending: productsInPlantheadLoading } =
    useQuery({
      queryKey: ["productsInPlanthead"],
      queryFn: async () => {
        const response = await axios.get(
          BASE_URL + API_PATHS.PLANT_HEAD.GET_PRODUCTS,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("planthead products", response.data.data);
        return response.data.data;
      },
      onError: (error) => {
        console.log(error);
      },
    });

  //GET single order using order id
  const { data: singleOrderFromPlanthead, isPending: singleOrderLoading } =
    useQuery({
      queryKey: ["singleOrder", id],
      queryFn: async () => {
        if (!id) return null;
        console.log("id", id);
        const response = await axios.get(
          BASE_URL + API_PATHS.PLANT_HEAD.GET_ORDER(id),
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("planthead single order", response.data.data);
        return response.data.data;
      },
      onError: (error) => {
        console.log(error);
      },
    });

  // DISPATCH Order in Planthead
  const { mutate: dispatchOrder, isPending: isDispatchingOrder } = useMutation({
    mutationFn: async (orderId) => {
      const response = await axios.put(
        BASE_URL + API_PATHS.PLANT_HEAD.DISPATCH_ORDER(orderId),
        {},
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
      queryClient.invalidateQueries({ queryKey: ["ordersInPlanthead"] });
      console.log(data);
      toast.success(data.message);
    },
    onError: (error) => {
      console.log(error);
      toast.error(error.response.data.message);
    },
  });

  // CREATE Order in Planthead
  const { mutate: createOrder, isPending: isCreatingOrder } = useMutation({
    mutationFn: async (data) => {
      const response = await axios.post(
        BASE_URL + API_PATHS.PLANT_HEAD.CREATE_ORDER,
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
      queryClient.invalidateQueries({ queryKey: ["ordersInPlanthead"] });
      console.log(data);
      toast.success(data.message);
    },
    onError: (error) => {
      console.log(error);
      toast.error(error.response.data.message);
    },
  });

  // DELETE Order in Planthead
  const { mutate: deleteOrder, isPending: isDeletingOrder } = useMutation({
    mutationFn: async (orderId) => {
      const response = await axios.delete(
        BASE_URL + API_PATHS.PLANT_HEAD.DELETE_ORDER(orderId),
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
      queryClient.invalidateQueries({ queryKey: ["ordersInPlanthead"] });
      console.log(data);
      toast.success(data.message);
    },
    onError: (error) => {
      console.log(error);
      toast.error(error.response.data.message);
    },
  });

  return {
    ordersInPlanthead,
    singleOrderFromPlanthead,
    productsInPlanthead,
    dispatchOrder,
    createOrder,
    deleteOrder,

    //Loading
    ordersInPlantheadLoading,
    productsInPlantheadLoading,
    singleOrderLoading,
    isCreatingOrder,
    isDeletingOrder,
    isDispatchingOrder,
  };
};
