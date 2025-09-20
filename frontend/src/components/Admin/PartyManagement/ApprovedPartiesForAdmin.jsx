import React, { useState } from "react";
import { formatRupee } from "../../../utils/formatRupee.js";
import { Button, TextField } from "@mui/material";
import { useAdminOrder } from "../../../hooks/useAdminOrders.js";
import { useForm } from "react-hook-form";
import { SquarePen } from "lucide-react";

const ApprovedPartiesForAdmin = ({ party }) => {
  const { updateParty, isUpdatingParty } = useAdminOrder();
  const [openEdit, setOpenEdit] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      companyName: party.companyName,
      contactPersonNumber: party.contactPersonNumber,
      address: party.address,
      discount: party.discount,
    },
  });

  const handleUpdateParty = (data) => {
    data.partyId = party._id;
    console.log(data);
    updateParty(data, {
      onSuccess: () => {
        setOpenEdit(false);
      },
    });
  };

  return (
    <div className="shadow bg-white lg:rounded-lg lg:p-4 lg:flex lg:flex-col justify-between hover:shadow-md transition-all">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <p className="text-left lg:text-lg lg:font-bold">
            {party.companyName}
          </p>
          {party?.partyStatus === "approved" && (
            <p className="p-1 px-3 text-xs text-green-700 font-semibold bg-green-100 rounded-full">
              Approved
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
        <div className="flex items-center justify-end mt-3">
          <div className="flex items-center gap-1">
            <SquarePen
              color="green"
              className="hover:bg-green-100 active:scale-95 transition-all p-1.5 rounded-lg"
              size={30}
              onClick={() => setOpenEdit(true)}
            />
          </div>
        </div>
      </div>

      {/* --- Edit party Modal --- */}
      {openEdit && (
        <div className="transition-all bg-black/30 backdrop-blur-sm w-full z-50 h-screen absolute top-0 left-0 flex items-center justify-center">
          <div className="bg-white p-7 rounded-lg w-[29rem]">
            <p className="text-xl font-semibold mb-7">
              Edit {party?.companyName}
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
              <div>
                <TextField
                  error={!!errors.discount}
                  size="small"
                  fullWidth
                  id="outlined-basic"
                  label="Discount"
                  variant="outlined"
                  {...register("discount", {
                    required: { value: true, message: "Discount is required" },
                  })}
                />
                {errors.discount && (
                  <span className="text-red-500 text-xs mt-1">
                    {errors.discount.message}
                  </span>
                )}
              </div>
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
                  loading={isUpdatingParty}
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

export default ApprovedPartiesForAdmin;
