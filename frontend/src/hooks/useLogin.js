import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { BASE_URL, API_PATHS } from "../../../backend/config/apiPaths";
import { useNavigate } from "react-router-dom";

const useLogin = () => {
  const navigate = useNavigate();
  const {
    mutate: login,
    isPending,
    error,
  } = useMutation({
    mutationFn: async (data) => {
      const response = await axios.post(
        BASE_URL + API_PATHS.AUTH.LOGIN(data.role),
        data
      );
      console.log(response.data);
      localStorage.setItem("token", response.data.data.token);
      return response.data;
    },
    onSuccess: (data) => {
      if (data.data.role === "Admin") navigate("/admin");
      if (data.data.role === "Salesman") navigate("/salesman");
    },
    onError: (error) => {
      console.log(error);
    },
  });

  return { login, isPending, error };
};

export default useLogin;
