import React, { useState } from "react";
import {
  Button,
  ButtonGroup,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import Salesman from "../../components/Admin/EmployeeManagement/Salesman";
import useEmployees from "../../hooks/useEmployees";
import SalesAuthorizer from "../../components/Admin/EmployeeManagement/SalesAuthorizer";
import SalesManager from "../../components/Admin/EmployeeManagement/SalesManager";
import PlantHead from "../../components/Admin/EmployeeManagement/PlantHead";
import Accountant from "../../components/Admin/EmployeeManagement/Accountant";
import { Controller, useForm } from "react-hook-form";
import TotalEmployees from "../../components/Admin/EmployeeManagement/TotalEmployees";

const EmployeeManagementPage = () => {
  const employeeTypes = [
    "Salesman",
    "Sales Manager",
    "Sales Authorizer",
    "Plant Head",
    "Accountant",
  ];

  const {
    // Salesman
    salesman,
    addSalesman,

    // Sales Manager
    salesmanager,
    addSalesManager,

    // Sales Authorizer
    salesauthorizer,
    addSalesAuthorizer,

    // Plant Head
    planthead,
    addPlantHead,

    // Accountant
    accountant,
    addAccountant,

    // isLoading
    isLoading,
    error,
  } = useEmployees();

  const [searchTerm, setSearchTerm] = useState("");
  const [isActive, setIsActive] = useState("Salesman");
  const [openForm, setOpenForm] = useState(false);

  const totalEmployees =
    salesman?.length +
    salesmanager?.length +
    salesauthorizer?.length +
    planthead?.length +
    accountant?.length;

  console.log(totalEmployees);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const FilteredSalesman = salesman?.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const FilteredSalesManager = salesmanager?.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const FilteredSalesAuthorizer = salesauthorizer?.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.email.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const FilteredPlantHead = planthead?.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.email.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const FilteredAccountant = accountant?.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const onSubmit = (data) => {
    console.log(data);
    if (data.role === "salesman") {
      addSalesman(data);
    }
    if (data.role === "salesmanager") {
      addSalesManager(data);
    }
    if (data.role === "salesauthorizer") {
      addSalesAuthorizer(data);
    }
    if (data.role === "planthead") {
      addPlantHead(data);
    }
    if (data.role === "accountant") {
      addAccountant(data);
    }
    setOpenForm(false);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      <div className="lg:flex lg:justify-between lg:items-center mb-5">
        <h1 className="lg:text-3xl lg:font-bold">Employee Management</h1>
        <Button
          size="small"
          variant="contained"
          disableElevation
          sx={{
            fontWeight: "600",
          }}
          startIcon={<AddIcon />}
          onClick={() => setOpenForm(true)}
        >
          Add Employee
        </Button>
      </div>
      <div className="grid grid-cols-4">
        <TotalEmployees total={totalEmployees} />
      </div>
      <div className="mt-5">
        <ButtonGroup aria-label="Medium-sized button group">
          {employeeTypes.map((employee) => (
            <Button
              key={employee._id}
              disableElevation
              variant={isActive === employee ? "contained" : "outlined"}
              sx={{
                textTransform: "none",
              }}
              onClick={() => setIsActive(employee)}
            >
              {employee}
            </Button>
          ))}
        </ButtonGroup>
      </div>
      <div className="mt-5">
        <TextField
          fullWidth
          size="small"
          label="Search employees by name or email address"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* ---Employee List--- */}
      <div>
        {isActive === "Salesman" && (
          <div className="mt-5 grid lg:grid-cols-3 gap-7">
            {FilteredSalesman?.map((item) => (
              <Salesman key={item._id} item={item} />
            ))}
          </div>
        )}

        {isActive === "Sales Manager" && (
          <div className="mt-5 grid lg:grid-cols-3 gap-7">
            {FilteredSalesManager?.map((item) => (
              <SalesManager key={item._id} item={item} />
            ))}
          </div>
        )}

        {isActive === "Sales Authorizer" && (
          <div className="mt-5 grid lg:grid-cols-3 gap-7">
            {FilteredSalesAuthorizer?.map((item) => (
              <SalesAuthorizer key={item._id} item={item} />
            ))}
          </div>
        )}

        {isActive === "Plant Head" && (
          <div className="mt-5 grid lg:grid-cols-3 gap-7">
            {FilteredPlantHead?.map((item) => (
              <PlantHead key={item._id} item={item} />
            ))}
          </div>
        )}

        {isActive === "Accountant" && (
          <div className="mt-5 grid lg:grid-cols-3 gap-7">
            {FilteredAccountant?.map((item) => (
              <Accountant key={item._id} item={item} />
            ))}
          </div>
        )}
      </div>

      {/* --- Add Employee Form --- */}
      {openForm && (
        <div className="transition-all bg-black/30 backdrop-blur-sm w-full z-50 h-screen absolute top-0 left-0 flex items-center justify-center">
          <div className="bg-white p-7 rounded-lg w-[29rem]">
            <p className="text-lg font-semibold mb-5">Add Employee</p>
            <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
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
                  defaultValue="salesman"
                  rules={{ required: "Role is required" }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      labelId="role-label"
                      id="role"
                      label="Role"
                    >
                      <MenuItem value="salesman">Salesman</MenuItem>
                      <MenuItem value="salesmanager">Sales Manager</MenuItem>
                      <MenuItem value="salesauthorizer">
                        Sales Authorizer
                      </MenuItem>
                      <MenuItem value="planthead">Plant Head</MenuItem>
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
              <TextField
                size="small"
                fullWidth
                id="outlined-basic"
                label="Name"
                variant="outlined"
                {...register("name", {
                  required: { value: true, message: "Name is required" },
                })}
              />
              <TextField
                size="small"
                fullWidth
                id="outlined-basic"
                label="Email"
                variant="outlined"
                {...register("email", {
                  required: { value: true, message: "Email is required" },
                })}
              />
              <TextField
                size="small"
                fullWidth
                id="outlined-basic"
                label="Password"
                variant="outlined"
                {...register("password", {
                  required: { value: true, message: "Password is required" },
                })}
              />
              <TextField
                size="small"
                fullWidth
                id="outlined-basic"
                label="Phone"
                variant="outlined"
                {...register("phone", {
                  required: { value: true, message: "Phone is required" },
                })}
              />
              <div className="flex items-center justify-end gap-3 mt-5">
                <Button
                  variant="outlined"
                  disableElevation
                  sx={{ textTransform: "none" }}
                  onClick={() => setOpenForm(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  disableElevation
                  sx={{ textTransform: "none" }}
                  type="submit"
                >
                  Add
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeManagementPage;
