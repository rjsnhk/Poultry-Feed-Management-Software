import { useEffect, useState } from "react";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { Badge, Button, Dialog, IconButton, useTheme } from "@mui/material";
import { useUser } from "../hooks/useUser";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import Avatar from "./Avatar";
import { NavLink, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  Power,
  PowerOff,
  LogOut,
  Sun,
  Moon,
  Monitor,
  Menu,
  X,
  Bell,
  MessageCircleMore,
  MessageCircle,
} from "lucide-react";
import { useTheme as myTheme } from "../context/ThemeContext.jsx";
import Notification from "./Notification.jsx";
import AdminNotification from "./AdminNotification.jsx";
import { MdDashboard } from "react-icons/md";
import { MdOutlineDashboard } from "react-icons/md";
import { RiBox3Fill, RiBox3Line } from "react-icons/ri";
import { FaRegUser, FaUser } from "react-icons/fa6";
import { IoCartOutline, IoCart } from "react-icons/io5";
import { MdOutlineWarehouse, MdWarehouse } from "react-icons/md";
import { HiMiniUsers, HiOutlineUsers } from "react-icons/hi2";
import { GiGrain } from "react-icons/gi";
import { useMediaQuery } from "@mui/material";
import { unsubscribeUser } from "../unsubscribeUser";
import useNotification from "../hooks/useNotification.js";
import logo from "../assets/logo4.png";
import { useUnreadChatsContext } from "../context/UnreadChatsContext";
import socket from "../utils/socket";

const Header = ({ isCollapsed, setIsCollapsed }) => {
  const theme = useTheme();
  const isSmDown = useMediaQuery(theme.breakpoints.down("sm"));
  const { unread } = useUnreadChatsContext();
  const totalUnread = Object.values(unread || {}).reduce((a, b) => a + b, 0);
  console.log(totalUnread);

  const { theme: themeContext, setTheme } = myTheme();
  const { changeStatus, user } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenNotification, setIsOpenNotification] = useState(false);
  const navigate = useNavigate();
  const [unReadNotificationsCount, setUnReadNotificationsCount] = useState(0);

  const handleLogout = async () => {
    await unsubscribeUser();
    localStorage.removeItem("token");
    navigate("/login");
    toast.error("You are logged out!");
  };

  //fetch notifications
  const { notifications, markRead } = useNotification(user._id);

  //count unread notifications
  useEffect(() => {
    if (notifications?.length > 0) {
      const unReadNotifications = notifications.filter(
        (notification) => !notification.read
      ).length;
      setUnReadNotificationsCount(unReadNotifications);
    }
  }, [notifications]);

  //mark notification as read
  useEffect(() => {
    if (isOpenNotification) {
      markRead();
      setUnReadNotificationsCount(0);
    }
  }, [isOpenNotification]);

  useEffect(() => {
    if (!user?._id) return;

    socket.emit("join", user._id);

    const onNotification = () => {
      if (isOpenNotification) return;
      setUnReadNotificationsCount((prev) => prev + 1);
    };

    socket.on("notification", onNotification);

    return () => {
      socket.off("notification", onNotification);
    };
  }, [user?._id, isOpenNotification]);

  return (
    <div className="dark:border-gray-700 h-14 dark:bg-gray-900 transition-all ease-in-out border-b border-neutral-100 z-50">
      <div className="flex lg:justify-end justify-between items-center gap-8 h-full px-10">
        <div className="hidden lg:block w-full">
          <div className="flex items-center justify-start gap-2 bg-[#1976D2] bg-clip-text text-transparent text-xl line-clamp-1 truncate font-bold">
            <img src={logo} alt="" className="w-7 h-7 dark:invert-[100%]" />
            <span className="text-[#1976D2] logo">Feed manager</span>
          </div>
        </div>
        <div className="md:block lg:hidden">
          {isCollapsed && (
            <div className="flex items-center gap-5">
              <Menu
                onClick={() => setIsCollapsed(false)}
                className="text-blue-600 cursor-pointer"
                size={20}
              />
              <div className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent line-clamp-1 truncate font-bold">
                <GiGrain className="text-xl text-blue-600" /> Feed manager
              </div>
            </div>
          )}

          {!isCollapsed && (
            <div className="lg:hidden md:block absolute top-0 left-0 h-lvh p-2 border border-gray-100 bg-white shadow-lg backdrop-blur-sm z-50 flex flex-col items-start justify-between pb-5">
              <div>
                <div className="flex items-center justify-between p-4 w-full">
                  <div className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent line-clamp-1 truncate font-bold">
                    <GiGrain className="lg:text-xl md:text-lg text-blue-600" />
                    <span className="text-base lg:text-base md:text-base">
                      Feed manager
                    </span>
                  </div>
                  <X
                    onClick={() => setIsCollapsed(true)}
                    className="text-blue-600 cursor-pointer"
                    size={20}
                  />
                </div>

                {user?.role === "Admin" && (
                  <div className="flex flex-col items-center justify-center md:m-2 lg:m-2 lg:gap-3 md:gap-2 gap-1 text-sm md:text-sm">
                    <NavLink
                      to="/admin/dashboard"
                      className={({ isActive }) =>
                        isActive
                          ? "transition-all bg-blue-100 p-2 w-full text-left rounded-lg"
                          : "transition-all hover:bg-blue-50 p-2 w-full text-gray-800 rounded-lg text-left"
                      }
                    >
                      {({ isActive }) => (
                        <div className="flex items-center gap-2 font-semibold w-56 h-6">
                          <div className="w-6 flex items-center justify-center">
                            {isActive ? (
                              <MdDashboard className="text-blue-600 text-lg" />
                            ) : (
                              <MdOutlineDashboard className="text-blue-600 text-lg" />
                            )}
                          </div>
                          <span
                            className={`${
                              isCollapsed
                                ? "hidden"
                                : "block line-clamp-1 truncate w-full text-gray-800"
                            }`}
                          >
                            Dashboard
                          </span>
                        </div>
                      )}
                    </NavLink>

                    <NavLink
                      to="/admin/product-management"
                      className={({ isActive }) =>
                        isActive
                          ? "transition-all bg-blue-100 p-2 w-full text-left rounded-lg"
                          : "transition-all hover:bg-blue-50 p-2 w-full text-gray-800 rounded-lg text-left"
                      }
                    >
                      {({ isActive }) => (
                        <div className="flex items-center gap-2 font-semibold w-56 h-6">
                          <div className="w-6 flex items-center justify-center">
                            {isActive ? (
                              <RiBox3Fill className="text-blue-600 text-lg" />
                            ) : (
                              <RiBox3Line className="text-blue-600 text-lg" />
                            )}
                          </div>
                          <span
                            className={`${
                              isCollapsed
                                ? "hidden"
                                : "block line-clamp-1 truncate w-full text-gray-800"
                            }`}
                          >
                            Product Management
                          </span>
                        </div>
                      )}
                    </NavLink>

                    <NavLink
                      to="/admin/employee-management"
                      className={({ isActive }) =>
                        isActive
                          ? "transition-all bg-blue-100 p-2 w-full text-left rounded-lg"
                          : "transition-all hover:bg-blue-50 p-2 w-full text-gray-800 rounded-lg text-left"
                      }
                    >
                      {({ isActive }) => (
                        <div className="flex items-center gap-2 font-semibold w-56 h-6">
                          <div className="w-6 flex items-center justify-center">
                            {isActive ? (
                              <FaUser className="text-blue-600" />
                            ) : (
                              <FaRegUser className="text-blue-600" />
                            )}
                          </div>
                          <span
                            className={`${
                              isCollapsed
                                ? "hidden"
                                : "block line-clamp-1 truncate w-full text-gray-800"
                            }`}
                          >
                            Employee Management
                          </span>
                        </div>
                      )}
                    </NavLink>
                    <NavLink
                      to="/admin/order-management"
                      className={({ isActive }) =>
                        isActive
                          ? "transition-all bg-blue-100 p-2 w-full text-left rounded-lg"
                          : "transition-all hover:bg-blue-50 p-2 w-full text-gray-800 rounded-lg text-left"
                      }
                    >
                      {({ isActive }) => (
                        <div className="flex items-center gap-2 font-semibold w-56 h-6">
                          <div className="w-6 flex items-center justify-center">
                            {isActive ? (
                              <IoCart className="text-blue-600 text-xl" />
                            ) : (
                              <IoCartOutline className="text-blue-600 text-xl" />
                            )}
                          </div>
                          <span
                            className={`${
                              isCollapsed
                                ? "hidden"
                                : "block line-clamp-1 truncate w-full text-gray-800"
                            }`}
                          >
                            Order Management
                          </span>
                        </div>
                      )}
                    </NavLink>
                    <NavLink
                      to="/admin/plant-management"
                      className={({ isActive }) =>
                        isActive
                          ? "transition-all bg-blue-100 p-2 w-full text-left rounded-lg"
                          : "transition-all hover:bg-blue-50 p-2 w-full text-gray-800 rounded-lg text-left"
                      }
                    >
                      {({ isActive }) => (
                        <div className="flex items-center gap-2 font-semibold w-56 h-6">
                          <div className="w-6 flex items-center justify-center">
                            {isActive ? (
                              <MdWarehouse className="text-blue-600 text-lg" />
                            ) : (
                              <MdOutlineWarehouse className="text-blue-600 text-lg" />
                            )}
                          </div>
                          <span
                            className={`${
                              isCollapsed
                                ? "hidden"
                                : "block line-clamp-1 truncate w-full text-gray-800"
                            }`}
                          >
                            Plant Management
                          </span>
                        </div>
                      )}
                    </NavLink>
                    <NavLink
                      to="/admin/party-management"
                      className={({ isActive }) =>
                        isActive
                          ? "transition-all bg-blue-100 p-2 w-full text-left rounded-lg"
                          : "transition-all hover:bg-blue-50 p-2 w-full text-gray-800 rounded-lg text-left"
                      }
                    >
                      {({ isActive }) => (
                        <div className="flex items-center gap-2 font-semibold w-56 h-6">
                          <div className="w-6 flex items-center justify-center">
                            {isActive ? (
                              <HiMiniUsers className="text-blue-600 text-xl" />
                            ) : (
                              <HiOutlineUsers className="text-blue-600 text-xl" />
                            )}
                          </div>
                          <span
                            className={`${
                              isCollapsed
                                ? "hidden"
                                : "block line-clamp-1 truncate w-full text-gray-800"
                            }`}
                          >
                            Party Management
                          </span>
                        </div>
                      )}
                    </NavLink>
                  </div>
                )}
                {user?.role === "Salesman" && (
                  <div className="flex flex-col items-center justify-center md:m-2 lg:m-2 lg:gap-3 md:gap-2 gap-1 text-sm md:text-sm">
                    <NavLink
                      to="/salesman/dashboard"
                      className={({ isActive }) =>
                        isActive
                          ? "transition-all bg-blue-100 dark:border-blue-200 border-blue-500 p-2 w-full text-left rounded-lg"
                          : "transition-all hover:bg-blue-50 dark:hover:bg-blue-700 p-2 w-full dark:text-gray-200 text-gray-800 rounded-lg text-left"
                      }
                    >
                      {({ isActive }) => (
                        <div className="flex items-center gap-2 font-semibold w-56 h-6">
                          <div className="w-6 flex items-center justify-center">
                            {isActive ? (
                              <IoCart className="text-blue-600 dark:text-gray-300 text-xl" />
                            ) : (
                              <IoCartOutline className="text-blue-600 dark:text-blue-500 text-xl" />
                            )}
                          </div>
                          <span
                            className={`${
                              isCollapsed
                                ? "hidden"
                                : "block line-clamp-1 truncate w-full text-gray-800 dark:text-gray-300"
                            }`}
                          >
                            Order Management
                          </span>
                        </div>
                      )}
                    </NavLink>
                    <NavLink
                      to="/salesman/party-management"
                      className={({ isActive }) =>
                        isActive
                          ? "transition-all bg-blue-100 dark:border-blue-200 border-blue-500 p-2 w-full text-left rounded-lg"
                          : "transition-all hover:bg-blue-50 dark:hover:bg-blue-700 p-2 w-full dark:text-gray-200 text-gray-800 rounded-lg text-left"
                      }
                    >
                      {({ isActive }) => (
                        <div className="flex items-center gap-2 font-semibold w-56 h-6">
                          <div className="w-6 flex items-center justify-center">
                            {isActive ? (
                              <HiMiniUsers className="text-blue-600 dark:text-gray-300 text-xl" />
                            ) : (
                              <HiOutlineUsers className="text-blue-600 dark:text-blue-500 text-xl" />
                            )}
                          </div>
                          <span
                            className={`${
                              isCollapsed
                                ? "hidden"
                                : "block line-clamp-1 truncate w-full text-gray-800 dark:text-gray-300"
                            }`}
                          >
                            Party Management
                          </span>
                        </div>
                      )}
                    </NavLink>
                  </div>
                )}
                {user?.role === "SalesManager" && (
                  <div className="flex flex-col items-center justify-center md:m-2 lg:m-2 lg:gap-3 md:gap-2 gap-1 text-sm md:text-sm">
                    <NavLink
                      to="/salesmanager/dashboard"
                      className={({ isActive }) =>
                        isActive
                          ? "transition-all bg-blue-100 p-2 w-full text-left rounded-lg"
                          : "transition-all hover:bg-blue-50 p-2 w-full text-gray-800 rounded-lg text-left"
                      }
                    >
                      {({ isActive }) => (
                        <div className="flex items-center gap-2 font-semibold w-56 h-6">
                          <div className="w-6 flex items-center justify-center">
                            {isActive ? (
                              <IoCart className="text-blue-600 text-xl" />
                            ) : (
                              <IoCartOutline className="text-blue-600 text-xl" />
                            )}
                          </div>
                          <span
                            className={`${
                              isCollapsed
                                ? "hidden"
                                : "block line-clamp-1 truncate w-full text-gray-800"
                            }`}
                          >
                            Order Management
                          </span>
                        </div>
                      )}
                    </NavLink>
                  </div>
                )}
                {user?.role === "SalesAuthorizer" && (
                  <div className="flex flex-col items-center justify-center md:m-2 lg:m-2 lg:gap-3 md:gap-2 gap-1 text-sm md:text-sm">
                    <NavLink
                      to="/salesauthorizer/dashboard"
                      className={({ isActive }) =>
                        isActive
                          ? "transition-all bg-blue-100 p-2 w-full text-left rounded-lg"
                          : "transition-all hover:bg-blue-50 p-2 w-full text-gray-800 rounded-lg text-left"
                      }
                    >
                      {({ isActive }) => (
                        <div className="flex items-center gap-2 font-semibold w-56 h-6">
                          <div className="w-6 flex items-center justify-center">
                            {isActive ? (
                              <IoCart className="text-blue-600 text-xl" />
                            ) : (
                              <IoCartOutline className="text-blue-600 text-xl" />
                            )}
                          </div>
                          <span
                            className={`${
                              isCollapsed
                                ? "hidden"
                                : "block line-clamp-1 truncate w-full text-gray-800"
                            }`}
                          >
                            Order Management
                          </span>
                        </div>
                      )}
                    </NavLink>
                  </div>
                )}
                {user?.role === "PlantHead" && (
                  <div className="flex flex-col items-center justify-center md:m-2 lg:m-2 lg:gap-3 md:gap-2 gap-1 text-sm md:text-sm">
                    <NavLink
                      to="/planthead/dashboard"
                      className={({ isActive }) =>
                        isActive
                          ? "transition-all bg-blue-100 p-2 w-full text-left rounded-lg"
                          : "transition-all hover:bg-blue-50 p-2 w-full text-gray-800 rounded-lg text-left"
                      }
                    >
                      {({ isActive }) => (
                        <div className="flex items-center gap-2 font-semibold w-56 h-6">
                          <div className="w-6 flex items-center justify-center">
                            {isActive ? (
                              <IoCart className="text-blue-600 text-xl" />
                            ) : (
                              <IoCartOutline className="text-blue-600 text-xl" />
                            )}
                          </div>
                          <span
                            className={`${
                              isCollapsed
                                ? "hidden"
                                : "block line-clamp-1 truncate w-full text-gray-800"
                            }`}
                          >
                            Order Management
                          </span>
                        </div>
                      )}
                    </NavLink>
                    <NavLink
                      to="/planthead/product-management"
                      className={({ isActive }) =>
                        isActive
                          ? "transition-all bg-blue-100 p-2 w-full text-left rounded-lg"
                          : "transition-all hover:bg-blue-50 p-2 w-full text-gray-800 rounded-lg text-left"
                      }
                    >
                      {({ isActive }) => (
                        <div className="flex items-center gap-2 font-semibold w-56 h-6">
                          <div className="w-6 flex items-center justify-center">
                            {isActive ? (
                              <RiBox3Fill className="text-blue-600 text-lg" />
                            ) : (
                              <RiBox3Line className="text-blue-600 text-lg" />
                            )}
                          </div>
                          <span
                            className={`${
                              isCollapsed
                                ? "hidden"
                                : "block line-clamp-1 truncate w-full text-gray-800"
                            }`}
                          >
                            Product Management
                          </span>
                        </div>
                      )}
                    </NavLink>
                  </div>
                )}
                {user?.role === "Accountant" && (
                  <div className="flex flex-col items-center justify-center md:m-2 lg:m-2 lg:gap-3 md:gap-2 gap-1 text-sm md:text-sm">
                    <NavLink
                      to="/accountant/dashboard"
                      className={({ isActive }) =>
                        isActive
                          ? "transition-all bg-blue-100 p-2 w-full text-left rounded-lg"
                          : "transition-all hover:bg-blue-50 p-2 w-full text-gray-800 rounded-lg text-left"
                      }
                    >
                      {({ isActive }) => (
                        <div className="flex items-center gap-2 font-semibold w-56 h-6">
                          <div className="w-6 flex items-center justify-center">
                            {isActive ? (
                              <IoCart className="text-blue-600 text-xl" />
                            ) : (
                              <IoCartOutline className="text-blue-600 text-xl" />
                            )}
                          </div>
                          <span
                            className={`${
                              isCollapsed
                                ? "hidden"
                                : "block line-clamp-1 truncate w-full text-gray-800"
                            }`}
                          >
                            Order Management
                          </span>
                        </div>
                      )}
                    </NavLink>
                  </div>
                )}
              </div>

              <div className="lg:hidden md:hidden w-full">
                <div className="w-full mb-4 flex gap-2 flex-col items-center justify-center">
                  {user?.role !== "Admin" && (
                    <Button
                      fullWidth
                      startIcon={
                        user.isActive ? (
                          <PowerOff size={15} />
                        ) : (
                          <Power size={15} />
                        )
                      }
                      onClick={() => changeStatus(user?.role)}
                      color="black"
                      sx={{
                        textTransform: "none",
                        fontSize: isSmDown ? "12px" : "14px",
                        borderRadius: "0px",
                        textAlign: "left",
                        justifyContent: "flex-start",
                        paddingLeft: "1.5rem",
                        "&:hover": {
                          backgroundColor: "#f3f4f6",
                        },
                      }}
                    >
                      {user.isActive
                        ? "Deactivate account"
                        : "Activate account"}
                    </Button>
                  )}

                  <Button
                    fullWidth
                    startIcon={<LogOut size={15} />}
                    onClick={handleLogout}
                    color="error"
                    sx={{
                      textTransform: "none",
                      borderRadius: "0px",
                      textAlign: "left",
                      justifyContent: "flex-start",
                      paddingLeft: "1.5rem",
                      fontSize: isSmDown ? "12px" : "14px",
                    }}
                  >
                    Logout
                  </Button>

                  <div className="rounded-full p-1 dark:bg-gray-500 items-center bg-gray-200 flex w-fit">
                    <div
                      onClick={() => setTheme("light")}
                      className={`${
                        themeContext === "light"
                          ? "bg-white text-orange-600 transition-all"
                          : "cursor-pointer hover:bg-gray-400 transition-all"
                      } p-1 px-2 rounded-full flex items-center gap-1 `}
                    >
                      <Sun size={12} />
                      <span className="text-[12px]">Light</span>
                    </div>
                    <div
                      onClick={() => setTheme("dark")}
                      className={`${
                        themeContext === "dark"
                          ? "bg-gray-800 text-gray-200 transition-all "
                          : "cursor-pointer hover:bg-gray-400 transition-all"
                      } p-1 px-2 rounded-full flex items-center gap-1`}
                    >
                      <Moon size={12} />
                      <span className="text-[12px]">Dark</span>
                    </div>
                    <div
                      onClick={() => setTheme("system")}
                      className={`${
                        themeContext === "system"
                          ? "bg-gray-800 text-gray-200 transition-all "
                          : "cursor-pointer hover:bg-gray-400 transition-all"
                      } p-1 px-2 rounded-full flex items-center gap-1`}
                    >
                      <Monitor size={12} />
                      <span className="text-[12px]">System</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col">
                  <div className="px-5 flex items-center gap-3">
                    <Avatar
                      alt={user?.name}
                      src="/static/images/avatar/1.jpg"
                      size={35}
                      name={user?.name}
                      online={user?.isActive}
                    />
                    <div className="flex flex-col">
                      <p className="text-xs">{user?.name}</p>
                      <p className="text-[10px]">{user?.email}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-12">
          <div className="hidden lg:block md:block">
            <p className="dark:text-gray-300 text-sm">{user?.role}</p>
          </div>

          <IconButton
            onClick={() => setIsOpenNotification(!isOpenNotification)}
          >
            {unReadNotificationsCount > 0 && (
              <div className="flex transition-all items-center gap-1 bg-red-600/20 absolute bottom-6 right-8 backdrop-blur-sm p-0.5 text-xs text-red-600 font-semibold px-1.5 rounded-full">
                <Bell size={12} strokeWidth={3} />
                {unReadNotificationsCount > 20
                  ? "20+"
                  : unReadNotificationsCount}
              </div>
            )}
            {totalUnread > 0 && (
              <div className="flex transition-all items-center gap-1 bg-blue-600/20 absolute bottom-6 left-8 backdrop-blur-sm p-0.5 text-xs text-blue-600 font-semibold px-1.5 rounded-full">
                <MessageCircle size={12} strokeWidth={3} />
                {totalUnread > 20 ? "20+" : totalUnread}
              </div>
            )}

            <NotificationsIcon className="dark:text-gray-300" />
          </IconButton>

          {isOpenNotification && (
            <>
              {user?.role === "Admin" ? (
                <AdminNotification
                  setIsOpenNotification={setIsOpenNotification}
                />
              ) : (
                <Notification setIsOpenNotification={setIsOpenNotification} />
              )}
            </>
          )}

          <div className="rounded-full p-1 dark:bg-gray-500 items-center bg-gray-300 hidden lg:flex md:flex">
            <div
              onClick={() => setTheme("light")}
              className={`${
                themeContext === "light"
                  ? "bg-gray-100 text-orange-600 transition-all"
                  : "cursor-pointer hover:bg-gray-400 transition-all"
              } p-1.5 rounded-full `}
            >
              <Sun size={14} />
            </div>
            <div
              onClick={() => setTheme("dark")}
              className={`${
                themeContext === "dark"
                  ? "bg-gray-800 text-gray-200 transition-all "
                  : "cursor-pointer hover:bg-gray-400 transition-all"
              } p-1.5 rounded-full`}
            >
              <Moon size={14} />
            </div>
            <div
              onClick={() => setTheme("system")}
              className={`${
                themeContext === "system"
                  ? "bg-gray-800 text-gray-200 transition-all "
                  : "cursor-pointer hover:bg-gray-400 transition-all"
              } p-1.5 rounded-full`}
            >
              <Monitor size={14} />
            </div>
          </div>

          <div className="items-center gap-2 hidden lg:flex md:flex">
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
                className="hover:bg-gray-100 transition-all rounded-full dark:hover:bg-gray-600 dark:text-gray-300"
              >
                <KeyboardArrowUpIcon />
              </div>
            ) : (
              <div
                onClick={() => setIsOpen(true)}
                className="hover:bg-gray-100 transition-all rounded-full dark:hover:bg-gray-600 dark:text-gray-300"
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
              className="absolute lg:top-14 lg:right-3 md:top-14 md:right-3 hidden lg:block md:block bg-white shadow-md rounded-lg z-50"
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
                      user.isActive ? (
                        <PowerOff size={15} />
                      ) : (
                        <Power size={15} />
                      )
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
    </div>
  );
};

export default Header;
