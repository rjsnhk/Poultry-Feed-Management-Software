import React from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex flex-col h-screen w-full">
        <div className="h-14">
          <Header />
        </div>
        <div className="p-5 overflow-y-auto flex-1 bg-slate-50">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
