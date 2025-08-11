import React from "react";
import { Controller, useForm } from "react-hook-form";
import useLogin from "../../hooks/useLogin";
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";

const LoginPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm();

  const { login, isPending, error } = useLogin();

  const onSubmit = (data) => {
    login(data);
  };

  if (isPending) return <div>Loading...</div>;

  if (error) return <div>{error.message}</div>;

  return (
    <div className="flex flex-col justify-center items-center h-screen w-full border-2 border-black">
      <div className="mb-5">
        <h1 className="text-4xl font-semibold text-center text-[20px] sm:text-3xl">
          Poultry Feed Management
        </h1>
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-5 w-96 max-w-[90%]"
      >
        <div>
          <FormControl
            fullWidth
            size="small"
            error={!!errors.role}
            className="mb-4"
          >
            <InputLabel id="role-label">Role</InputLabel>
            <Controller
              name="role"
              control={control}
              defaultValue=""
              rules={{ required: "Role is required" }}
              render={({ field }) => (
                <Select {...field} labelId="role-label" id="role" label="Role">
                  <MenuItem value="">Select Role</MenuItem>
                  <MenuItem value="admin">Admin</MenuItem>
                  <MenuItem value="salesman">Salesman</MenuItem>
                  <MenuItem value="manager">Sales Manager</MenuItem>
                  <MenuItem value="authorizer">Sales Authorizer</MenuItem>
                  <MenuItem value="plant_head">Plant Head</MenuItem>
                  <MenuItem value="accountant">Accountant</MenuItem>
                </Select>
              )}
            />
            {errors?.role && (
              <span className="text-red-500 text-sm mt-1">
                {errors.role.message}
              </span>
            )}
          </FormControl>
        </div>
        <div>
          <TextField
            error={!!errors.email}
            size="small"
            fullWidth
            id="email"
            label="Email"
            variant="outlined"
            {...register("email", {
              required: { value: true, message: "Email is required" },
            })}
          />
          {errors?.email && (
            <span className="text-red-500">{errors?.email?.message}</span>
          )}
        </div>
        <div>
          <TextField
            error={!!errors.password}
            size="small"
            id="password"
            fullWidth
            label="Password"
            variant="outlined"
            {...register("password", {
              required: { value: true, message: "Password is required" },
            })}
          />
          {errors?.password && (
            <span className="text-red-500">{errors?.password?.message}</span>
          )}
        </div>
        <Button disableElevation fullWidth type="submit" variant="contained">
          Login
        </Button>
      </form>
    </div>
  );
};

export default LoginPage;
