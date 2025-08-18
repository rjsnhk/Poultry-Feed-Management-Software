import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { API_PATHS, BASE_URL } from "../utils/apiPaths";
import axios from "axios";
import { toast } from "react-hot-toast";

export const useSalesAuthorizerOrder = (id) => {
  const token = localStorage.getItem("token");
  const queryClient = useQueryClient();

  // GET all assigned orders from sales manager
  const {
    data: ordersInSalesAuthorizer,
    isPending: ordersInSalesAuthorizerLoading,
  } = useQuery({
    queryKey: ["ordersInSalesAuthorizer"],
    queryFn: async () => {
      const response = await axios.get(
        BASE_URL + API_PATHS.AUTHORIZER.GET_ASSIGNED_ORDERS,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("sales authorizer orders", response.data.data);
      return response.data.data;
    },
    onError: (error) => {
      console.log(error);
    },
  });

  //GET all warehouses
  const { data: allWarehouses, isPending: warehousesLoading } = useQuery({
    queryKey: ["allWarehousesFromAuthorizer"],
    queryFn: async () => {
      const response = await axios.get(
        BASE_URL + API_PATHS.AUTHORIZER.GET_ALL_WAREHOUSES,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("sales authorizer warehouses", response.data.data);
      return response.data.data;
    },
    onError: (error) => {
      console.log(error);
    },
  });

  //GET single order using order id
  const {
    data: singleOrderFromSalesauthorizer,
    isPending: singleOrderLoading,
  } = useQuery({
    queryKey: ["singleOrderFromSalesauthorizer", id],
    queryFn: async () => {
      if (!id) return null;
      console.log("id", id);
      const response = await axios.get(
        BASE_URL + API_PATHS.AUTHORIZER.GET_ORDER(id),
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

  //ASSIGN Warehouse to an order
  const { mutate: assignWarehouseToOrder, isPending: assignWarehouseLoading } =
    useMutation({
      mutationFn: async (data) => {
        console.log(data);
        const response = await axios.put(
          BASE_URL + API_PATHS.AUTHORIZER.ASSIGN_WAREHOUSE(data.orderId),
          { warehouseId: data.warehouseId },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("assign warehouse response", response.data);
        return response.data;
      },
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: ["order"] });
        queryClient.invalidateQueries({
          queryKey: ["ordersInSalesAuthorizer"],
        });
        console.log(data);
        toast.success(data.message);
      },
      onError: (error) => {
        console.log(error);
        toast.error(error.response.data.message);
      },
    });

  return {
    ordersInSalesAuthorizer,
    singleOrderFromSalesauthorizer,
    allWarehouses,
    assignWarehouseToOrder,

    //Loading
    ordersInSalesAuthorizerLoading,
    singleOrderLoading,
    warehousesLoading,
    assignWarehouseLoading,
  };
};
