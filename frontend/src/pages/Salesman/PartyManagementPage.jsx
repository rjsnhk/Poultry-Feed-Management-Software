import React, { useState } from "react";
import { useSalesmanOrder } from "../../hooks/useSalesmanOrder";
import Party from "../../components/Salesman/PartyManagement/Party";
import ApprovedParties from "../../components/Salesman/PartyManagement/ApprovedParties";
import {
  Button,
  ButtonGroup,
  CircularProgress,
  TextField,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useForm } from "react-hook-form";
import { useUser } from "../../hooks/useUser";
import RejectedParties from "../../components/Salesman/PartyManagement/RejectedParties";

const PartyManagementPage = () => {
  const [singleOrderId, setSingleOrderId] = useState(null);
  const partyTypes = ["All Parties", "Approved Parties", "Rejected Parties"];
  const [isActive, setIsActive] = useState("All Parties");
  const [openAdd, setOpenAdd] = useState(false);

  const { user } = useUser();

  const {
    parties,
    approvedParties,
    rejectedParties,
    partiesLoading,
    approvedPartiesLoading,
    rejectedPartiesLoading,
    addParty,
    addingParty,
  } = useSalesmanOrder(singleOrderId);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log(data);
    addParty(data, {
      onSuccess: () => {
        setOpenAdd(false);
      },
    });
  };

  if (partiesLoading || approvedPartiesLoading || rejectedPartiesLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <CircularProgress />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="lg:text-3xl lg:font-bold mb-5">{isActive}</h1>
        <Button
          disableElevation
          size="small"
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenAdd(true)}
          sx={{
            fontWeight: "600",
          }}
          disabled={!user.isActive}
        >
          Add Party
        </Button>
      </div>

      <div className="mb-5">
        <ButtonGroup aria-label="Medium-sized button group">
          {partyTypes.map((party) => (
            <Button
              key={party}
              disableElevation
              variant={isActive === party ? "contained" : "outlined"}
              sx={{
                textTransform: "none",
              }}
              onClick={() => setIsActive(party)}
            >
              {party}
            </Button>
          ))}
        </ButtonGroup>
      </div>

      <div className="mb-5">
        {isActive === "All Parties" && (
          <div className="grid grid-cols-3 gap-7">
            {parties?.length > 0 ? (
              parties?.map((party) => <Party party={party} key={party._id} />)
            ) : (
              <div className="flex items-center justify-center w-full text-center">
                <p className="text-gray-500">No parties found</p>
              </div>
            )}
          </div>
        )}
        {isActive === "Approved Parties" && (
          <div className="grid grid-cols-3 gap-7">
            {approvedParties?.length > 0 ? (
              approvedParties?.map((party) => (
                <ApprovedParties party={party} key={party._id} />
              ))
            ) : (
              <div className="flex items-center justify-center w-full text-center">
                <p className="text-gray-500">No approved parties found</p>
              </div>
            )}
          </div>
        )}
        {isActive === "Rejected Parties" && (
          <div className="grid grid-cols-3 gap-7">
            {rejectedParties?.length > 0 ? (
              rejectedParties?.map((party) => (
                <RejectedParties party={party} key={party._id} />
              ))
            ) : (
              <div className="flex items-center justify-center w-full text-center">
                <p className="text-gray-500">No rejected parties found</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* --- Add Party Modal --- */}
      {openAdd && (
        <div className="transition-all bg-black/30 backdrop-blur-sm w-full z-50 h-screen absolute top-0 left-0 flex items-center justify-center">
          <div className="bg-white p-7 rounded-lg w-[29rem]">
            <p className="text-xl font-semibold mb-7">Add a new party</p>
            <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
              <TextField
                size="small"
                fullWidth
                id="outlined-basic"
                label="Company Name"
                variant="outlined"
                error={!!errors.companyName}
                helperText={
                  errors.companyName && (
                    <span className="text-red-600 text-xs mt-1">
                      {errors.companyName.message}
                    </span>
                  )
                }
                {...register("companyName", {
                  required: {
                    value: true,
                    message: "Company Name is required",
                  },
                })}
              />

              <TextField
                size="small"
                fullWidth
                type="number"
                id="outlined-basic"
                label="Contact Person Number"
                variant="outlined"
                error={!!errors.contactPersonNumber}
                helperText={
                  errors.contactPersonNumber && (
                    <span className="text-red-600 text-xs mt-1">
                      {errors.contactPersonNumber.message}
                    </span>
                  )
                }
                {...register("contactPersonNumber", {
                  required: {
                    value: true,
                    message: "Contact person number is required",
                  },
                })}
              />

              <TextField
                size="small"
                fullWidth
                id="outlined-basic"
                label="Address"
                variant="outlined"
                error={!!errors.address}
                helperText={
                  errors.address && (
                    <span className="text-red-600 text-xs mt-1">
                      {errors.address.message}
                    </span>
                  )
                }
                {...register("address", {
                  required: {
                    value: true,
                    message: "Address is required",
                  },
                })}
              />

              <TextField
                size="small"
                fullWidth
                type="number"
                id="outlined-basic"
                label="Limit"
                variant="outlined"
                error={!!errors.limit}
                helperText={
                  errors.limit && (
                    <span className="text-red-600 text-xs mt-1">
                      {errors.limit.message}
                    </span>
                  )
                }
                {...register("limit", {
                  required: {
                    value: true,
                    message: "Limit is required",
                  },
                })}
              />

              <div className="flex items-center justify-end gap-3 mt-5">
                <Button
                  variant="outlined"
                  disableElevation
                  sx={{ textTransform: "none" }}
                  onClick={() => setOpenAdd(false)}
                >
                  Cancel
                </Button>
                <Button
                  loading={addingParty}
                  loadingPosition="start"
                  variant="contained"
                  disableElevation
                  sx={{ textTransform: "none" }}
                  type="submit"
                >
                  Add Party
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PartyManagementPage;
