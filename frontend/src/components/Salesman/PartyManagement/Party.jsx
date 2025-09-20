import React, { useState } from "react";
import { SquarePen, Trash2 } from "lucide-react";
import { Button, CircularProgress, TextField } from "@mui/material";
import { useForm } from "react-hook-form";
import { formatRupee } from "../../../utils/formatRupee.js";
import { useSalesmanOrder } from "../../../hooks/useSalesmanOrder";
import { useUser } from "../../../hooks/useUser";

const Party = ({ party }) => {
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  const { user } = useUser();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      companyName: party.companyName,
      contactPersonNumber: party.contactPersonNumber,
      address: party.address,
      limit: party.limit,
    },
  });

  const {
    sendPartyForApproval,
    sendingPartyForApproval,
    updateParty,
    updatingParty,
    deleteParty,
    deletingParty,
  } = useSalesmanOrder();

  const handleSendForApproval = (id) => {
    console.log(id);
    sendPartyForApproval(id);
  };

  const handleUpdateParty = (data) => {
    data.partyId = party._id;
    console.log(data);
    updateParty(data, {
      onSuccess: () => {
        setOpenEdit(false);
      },
    });
  };

  if (sendingPartyForApproval) {
    return <CircularProgress />;
  }

  return (
    <div className="shadow bg-white lg:rounded-lg lg:p-4 lg:flex lg:flex-col justify-between hover:shadow-md transition-all">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <p className="text-left lg:text-lg lg:font-bold">
            {party.companyName}
          </p>
          {party?.partyStatus === "approved" && (
            <p className="text-green-700 font-semibold text-xs p-1 px-2 bg-green-100 rounded-full">
              Approved
            </p>
          )}
          {party?.partyStatus === "pending" && (
            <p className="text-orange-700 font-semibold text-xs p-1 px-2 bg-orange-100 rounded-full">
              Pending
            </p>
          )}
          {party?.partyStatus === "sentForApproval" && (
            <p className="text-violet-700 font-semibold text-xs p-1 px-2 bg-violet-100 rounded-full">
              Sent for approval
            </p>
          )}
          {party?.partyStatus === "rejected" && (
            <p className="text-red-700 font-semibold text-xs p-1 px-2 bg-red-100 rounded-full">
              Rejected
            </p>
          )}
        </div>
        <div className="flex flex-col gap-5 mt-2">
          <div className="flex flex-col gap-2 text-sm">
            <div className="flex items-center justify-between font-semibold">
              <span className="text-gray-600 font-normal text-right">
                Address:
              </span>
              <span className="text-right">{party?.address}</span>
            </div>
            <div className="flex items-center justify-between font-semibold">
              <span className="text-gray-600 font-normal text-right">
                Contact Person Number:
              </span>
              {party?.contactPersonNumber}
            </div>

            <div className="flex items-center justify-between font-semibold">
              <span className="text-gray-600 font-normal text-right">
                Limit:
              </span>
              {formatRupee(party?.limit)}
            </div>
          </div>
        </div>
      </div>
      <div
        className={
          party.partyStatus === "pending"
            ? "flex items-center justify-between mt-3"
            : "flex items-center justify-end mt-3"
        }
      >
        {party.partyStatus === "pending" && (
          <div>
            <Button
              sx={{ textTransform: "none" }}
              color="secondary"
              disableElevation
              onClick={() => handleSendForApproval(party._id)}
            >
              Send for Approval
            </Button>
          </div>
        )}
        <div className="flex items-center gap-1">
          {user.isActive ? (
            <SquarePen
              color="green"
              className="hover:bg-green-100 active:scale-95 transition-all p-1.5 rounded-lg"
              size={30}
              onClick={() => setOpenEdit(true)}
            />
          ) : (
            <SquarePen
              color="gray"
              className="p-1.5 rounded-lg cursor-not-allowed"
              size={30}
            />
          )}
          {user.isActive ? (
            <Trash2
              color="red"
              className="hover:bg-red-100 active:scale-95 transition-all p-1.5 rounded-lg"
              size={30}
              onClick={() => setOpenDelete(true)}
            />
          ) : (
            <Trash2
              color="gray"
              className="p-1.5 rounded-lg cursor-not-allowed"
              size={30}
            />
          )}
        </div>
      </div>

      {/* --- Delete party Modal --- */}
      {openDelete && (
        <div className="transition-all bg-black/30 backdrop-blur-sm w-full z-50 h-screen absolute top-0 left-0 flex items-center justify-center">
          <div className="bg-white p-7 rounded-lg w-[29rem]">
            <p className="text-lg font-semibold">
              Are you sure you want to delete {party.companyName}?
            </p>
            <p className="text-gray-500 text-sm">
              This action cannot be undone. {party.companyName}'s data will be
              permanently removed.
            </p>
            <div className="flex items-center justify-end gap-3 mt-5">
              <Button
                variant="outlined"
                disableElevation
                color="error"
                sx={{ textTransform: "none" }}
                onClick={() => setOpenDelete(false)}
              >
                Cancel
              </Button>
              <Button
                loading={deletingParty}
                loadingPosition="start"
                variant="contained"
                disableElevation
                color="error"
                sx={{ textTransform: "none" }}
                onClick={() => deleteParty(party._id)}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* --- Edit party Modal --- */}
      {openEdit && (
        <div className="transition-all bg-black/30 backdrop-blur-sm w-full z-50 h-screen absolute top-0 left-0 flex items-center justify-center">
          <div className="bg-white p-7 rounded-lg w-[29rem]">
            <p className="text-xl font-semibold mb-7">
              Edit {party.companyName}
            </p>
            <form
              className="space-y-5"
              onSubmit={handleSubmit(handleUpdateParty)}
            >
              <div>
                <TextField
                  size="small"
                  fullWidth
                  id="outlined-basic"
                  label=" Company Name"
                  variant="outlined"
                  {...register("companyName", {
                    required: {
                      value: true,
                      message: "Company Name is required",
                    },
                  })}
                />
                {errors.companyName && (
                  <span className="text-red-500 text-xs mt-1">
                    {errors.companyName.message}
                  </span>
                )}
              </div>
              <div>
                <TextField
                  size="small"
                  fullWidth
                  id="outlined-basic"
                  type="number"
                  label="Contact Person Number"
                  variant="outlined"
                  {...register("contactPersonNumber", {
                    required: {
                      value: true,
                      message: "Contact Person Number is required",
                    },
                  })}
                />
                {errors.contactPersonNumber && (
                  <span className="text-red-500 text-xs mt-1">
                    {errors.contactPersonNumber.message}
                  </span>
                )}
              </div>
              <div>
                <TextField
                  size="small"
                  fullWidth
                  id="outlined-basic"
                  label="Address"
                  variant="outlined"
                  {...register("address", {
                    required: { value: true, message: "Address is required" },
                  })}
                />
                {errors.address && (
                  <span className="text-red-500 text-xs mt-1">
                    {errors.address.message}
                  </span>
                )}
              </div>
              <TextField
                error={!!errors.limit}
                size="small"
                fullWidth
                id="outlined-basic"
                label="Limit"
                variant="outlined"
                helperText={
                  errors.limit && (
                    <span className="text-red-500 text-xs mt-1">
                      {errors.limit.message}
                    </span>
                  )
                }
                {...register("limit", {
                  required: { value: true, message: "Limit is required" },
                })}
              />

              <div className="flex items-center justify-end gap-3 mt-5">
                <Button
                  variant="outlined"
                  disableElevation
                  sx={{ textTransform: "none" }}
                  onClick={() => setOpenEdit(false)}
                >
                  Cancel
                </Button>
                <Button
                  loading={updatingParty}
                  loadingPosition="start"
                  variant="contained"
                  disableElevation
                  sx={{ textTransform: "none" }}
                  type="submit"
                >
                  Save
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Party;
