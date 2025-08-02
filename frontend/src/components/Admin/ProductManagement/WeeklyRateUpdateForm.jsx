import React from "react";
import { TextField, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

const WeeklyRateUpdateForm = () => {
  return (
    <div>
      <form>
        <TextField
          size="small"
          fullWidth
          id="email"
          label="Product Name"
          variant="outlined"
        />
        <TextField
          size="small"
          fullWidth
          id="email"
          label="Price"
          variant="outlined"
        />
        <Button
          size="small"
          variant="contained"
          disableElevation
          sx={{
            fontWeight: "600",
          }}
          startIcon={<AddIcon />}
        >
          Add
        </Button>
      </form>
    </div>
  );
};

export default WeeklyRateUpdateForm;
