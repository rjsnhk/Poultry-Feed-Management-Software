import React, { useState } from "react";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { Button, IconButton } from "@mui/material";
import { useUser } from "../hooks/useUser";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import Avatar from "./Avatar";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Power, PowerOff, LogOut } from "lucide-react";

const Header = () => {
  const { changeStatus, user } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
    toast.error("You are logged out!");
  };

  return (
    <div className="border-b border-neutral-100 h-full z-50">
      <div className="flex justify-end items-center gap-8 h-full px-10">
        <div>
          <p>{user?.role}</p>
        </div>
        <IconButton>
          <NotificationsIcon />
        </IconButton>

        <div className="flex items-center gap-2">
          <Avatar
            alt={user?.name}
            src="/static/images/avatar/1.jpg"
            size={40}
            name={user?.name}
            online={user?.isActive}
          />
          {isOpen ? (
            <div
              onClick={() => setIsOpen(false)}
              className="hover:bg-gray-100 transition-all rounded-full"
            >
              <KeyboardArrowUpIcon />
            </div>
          ) : (
            <div
              onClick={() => setIsOpen(true)}
              className="hover:bg-gray-100 transition-all rounded-full"
            >
              <KeyboardArrowDownIcon />
            </div>
          )}
        </div>
      </div>
      {isOpen && (
        <div onClick={() => setIsOpen(false)} className="fixed inset-0 z-40">
          <div
            onClick={(e) => e.stopPropagation()}
            className="absolute top-14 right-3 bg-white shadow-md rounded-lg z-50"
          >
            <div className="flex flex-col py-2 w-64">
              <div className="mx-2 p-2 border-b border-gray-100 flex items-center gap-3 mb-2">
                <Avatar
                  alt={user?.name}
                  src="/static/images/avatar/1.jpg"
                  size={40}
                  name={user?.name}
                  online={user?.isActive}
                />
                <div className="flex flex-col">
                  <p className="text-sm">{user?.name}</p>
                  <p className="text-xs">{user?.email}</p>
                </div>
              </div>
              {user?.role !== "Admin" && (
                <Button
                  startIcon={
                    user.isActive ? <PowerOff size={15} /> : <Power size={15} />
                  }
                  onClick={() => changeStatus(user.role)}
                  color="black"
                  sx={{
                    textTransform: "none",
                    borderRadius: "0px",
                    textAlign: "left",
                    justifyContent: "flex-start",
                    paddingLeft: "1.5rem",
                    "&:hover": {
                      backgroundColor: "#f3f4f6",
                    },
                  }}
                >
                  {user.isActive ? "Deactivate account" : "Activate account"}
                </Button>
              )}
              <Button
                startIcon={<LogOut size={15} />}
                onClick={handleLogout}
                color="error"
                sx={{
                  textTransform: "none",
                  borderRadius: "0px",
                  textAlign: "left",
                  justifyContent: "flex-start",
                  paddingLeft: "1.5rem",
                }}
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;
