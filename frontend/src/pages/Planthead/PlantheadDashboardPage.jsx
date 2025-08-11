import { Button } from "@mui/material";
import React from "react";
import AddIcon from "@mui/icons-material/Add";
import { useUser } from "../../hooks/useUser";

const PlantheadDashboardPage = () => {
  const { changeStatus, user, isPending, changeStatusPending } = useUser();
  console.log("user", user);

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="lg:text-3xl lg:font-bold mb-5">Plant Head</h1>
        <Button
          disableElevation
          variant="contained"
          size="small"
          startIcon={<AddIcon />}
          onClick={() => changeStatus(user?.role)}
          loading={changeStatusPending || isPending}
        >
          {user?.isActive ? "Deactivate" : "Activate"}
        </Button>
      </div>
    </div>
  );
};

export default PlantheadDashboardPage;
