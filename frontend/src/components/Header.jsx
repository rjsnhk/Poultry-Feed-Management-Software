import React from "react";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { Avatar, Button, IconButton } from "@mui/material";

const Header = () => {
  return (
    <div className="border-b border-neutral-100 h-full">
      <div className="flex justify-end items-center gap-8 h-full px-10">
        <IconButton>
          <NotificationsIcon />
        </IconButton>

        <Avatar alt="Ravi" src="/static/images/avatar/1.jpg" />
      </div>
    </div>
  );
};

export default Header;
