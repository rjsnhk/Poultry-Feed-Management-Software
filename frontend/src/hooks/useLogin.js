import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { BASE_URL, API_PATHS } from "../../../backend/config/apiPaths";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const useLogin = () => {
  const navigate = useNavigate();
  const {
    mutate: login,
    isPending,
    error,
  } = useMutation({
    mutationFn: async (data) => {
      const role = data.role.toUpperCase();
      console.log(role);

      const response = await axios.post(BASE_URL + API_PATHS[role].LOGIN, data);
      console.log("data", response.data);
      localStorage.setItem("token", response.data.data.token);
      return response.data;
    },
    onSuccess: (data) => {
      if (data.data.role === "Admin") navigate("/admin");
      if (data.data.role === "Salesman") navigate("/salesman");
      if (data.data.role === "SalesManager") navigate("/salesmanager");
      if (data.data.role === "SalesAuthorizer") navigate("/salesauthorizer");
      if (data.data.role === "PlantHead") navigate("/planthead");
      if (data.data.role === "Accountant") navigate("/accountant");
    },
    onError: (error) => {
      console.log(error.response.data.message);
      toast.error(error.response.data.message);
    },
  });

  return { login, isPending, error };
};

export default useLogin;
