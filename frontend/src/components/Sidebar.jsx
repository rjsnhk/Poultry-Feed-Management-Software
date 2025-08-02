import React, { useState } from "react";
import { NavLink } from "react-router";
import { MdDashboard } from "react-icons/md";
import { MdOutlineDashboard } from "react-icons/md";
import { RiBox3Fill, RiBox3Line } from "react-icons/ri";
import { FaHandshake, FaRegUser, FaUser } from "react-icons/fa6";
import { FaRegHandshake } from "react-icons/fa";
import { HiDocumentText } from "react-icons/hi";
import { HiOutlineDocumentText } from "react-icons/hi";
import { PiGearSixFill } from "react-icons/pi";
import { TbLayoutSidebarLeftCollapse } from "react-icons/tb";
import { TbLayoutSidebarLeftExpand } from "react-icons/tb";
import { IoSettingsOutline } from "react-icons/io5";
import { IoCartOutline, IoCart } from "react-icons/io5";
import { PiWarehouse, PiWarehouseFill } from "react-icons/pi";

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div
      className={`${
        isCollapsed
          ? "w-16 transition-all duration-500"
          : "w-[20rem] transition-all duration-500"
      } border-r border-neutral-100`}
    >
      <div className="text-xl flex items-center justify-around font-semibold text-center mt-5">
        {!isCollapsed && (
          <p className="hidden lg:block line-clamp-1 truncate">Feed manager</p>
        )}
        {isCollapsed ? (
          <TbLayoutSidebarLeftExpand
            className="hover:bg-blue-100 transition-all p-2 text-4xl rounded-lg"
            onClick={() => setIsCollapsed(false)}
          />
        ) : (
          <TbLayoutSidebarLeftCollapse
            className="hover:bg-blue-100 transition-all p-2 text-4xl rounded-lg"
            onClick={() => setIsCollapsed(true)}
          />
        )}
      </div>
      <div className="mt-10 flex flex-col items-center justify-center m-2 gap-3">
        <NavLink
          to="/admin/dashboard"
          className={({ isActive }) =>
            isActive
              ? "transition-all bg-blue-100 border-e-4 border-blue-500 p-2 w-full text-left rounded-lg"
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
                  isCollapsed ? "hidden" : "block line-clamp-1 truncate w-full"
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
              ? "transition-all bg-blue-100 border-e-4 border-blue-500 p-2 w-full text-left rounded-lg"
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
                  isCollapsed ? "hidden" : "block line-clamp-1 truncate w-full"
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
              ? "transition-all bg-blue-100 border-e-4 border-blue-500 p-2 w-full text-left rounded-lg"
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
                  isCollapsed ? "hidden" : "block line-clamp-1 truncate w-full"
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
              ? "transition-all bg-blue-100 border-e-4 border-blue-500 p-2 w-full text-left rounded-lg"
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
                  isCollapsed ? "hidden" : "block line-clamp-1 truncate w-full"
                }`}
              >
                Order Management
              </span>
            </div>
          )}
        </NavLink>
        <NavLink
          to="/admin/warehouse-management"
          className={({ isActive }) =>
            isActive
              ? "transition-all bg-blue-100 border-e-4 border-blue-500 p-2 w-full text-left rounded-lg"
              : "transition-all hover:bg-blue-50 p-2 w-full text-gray-800 rounded-lg text-left"
          }
        >
          {({ isActive }) => (
            <div className="flex items-center gap-2 font-semibold w-56 h-6">
              <div className="w-6 flex items-center justify-center">
                {isActive ? (
                  <PiWarehouseFill className="text-blue-600 text-md" />
                ) : (
                  <PiWarehouse className="text-blue-600 text-md" />
                )}
              </div>
              <span
                className={`${
                  isCollapsed ? "hidden" : "block line-clamp-1 truncate w-full"
                }`}
              >
                Warehouse Management
              </span>
            </div>
          )}
        </NavLink>

        <NavLink
          to="/admin/party-master"
          className={({ isActive }) =>
            isActive
              ? "transition-all bg-blue-100 border-e-4 border-blue-500 p-2 w-full text-left rounded-lg"
              : "transition-all hover:bg-blue-50 p-2 w-full text-gray-800 rounded-lg text-left"
          }
        >
          {({ isActive }) => (
            <div className="flex items-center gap-2 font-semibold w-56 h-6">
              <div className="w-6 flex items-center justify-center">
                {isActive ? (
                  <FaHandshake className="text-blue-600 text-xl" />
                ) : (
                  <FaRegHandshake className="text-blue-600 text-xl" />
                )}
              </div>
              <span
                className={`${
                  isCollapsed ? "hidden" : "block line-clamp-1 truncate w-full"
                }`}
              >
                Party Master
              </span>
            </div>
          )}
        </NavLink>

        <NavLink
          to="/admin/reports-module"
          className={({ isActive }) =>
            isActive
              ? "transition-all bg-blue-100 border-e-4 border-blue-500 p-2 w-full text-left rounded-lg"
              : "transition-all hover:bg-blue-50 p-2 w-full text-gray-800 rounded-lg text-left"
          }
        >
          {({ isActive }) => (
            <div className="flex items-center gap-2 font-semibold w-56 h-6">
              <div className="w-6 flex items-center justify-center">
                {isActive ? (
                  <HiDocumentText className="text-blue-600 text-lg" />
                ) : (
                  <HiOutlineDocumentText className="text-blue-600 text-lg" />
                )}
              </div>
              <span
                className={`${
                  isCollapsed ? "hidden" : "block line-clamp-1 truncate w-full"
                }`}
              >
                Reports Module
              </span>
            </div>
          )}
        </NavLink>
        <NavLink
          to="/admin/settings-security"
          className={({ isActive }) =>
            isActive
              ? "transition-all bg-blue-100 border-e-4 border-blue-500 p-2 w-full text-left rounded-lg"
              : "transition-all hover:bg-blue-50 p-2 w-full text-gray-800 rounded-lg text-left"
          }
        >
          {({ isActive }) => (
            <div className="flex items-center gap-2 font-semibold w-56 h-6">
              <div className="w-6 flex items-center justify-center">
                {isActive ? (
                  <PiGearSixFill className="text-blue-600 text-lg" />
                ) : (
                  <IoSettingsOutline className="text-blue-600 text-lg" />
                )}
              </div>
              <span
                className={`${
                  isCollapsed ? "hidden" : "block line-clamp-1 truncate w-full"
                }`}
              >
                Settings & Security
              </span>
            </div>
          )}
        </NavLink>
      </div>
    </div>
  );
};

export default Sidebar;
