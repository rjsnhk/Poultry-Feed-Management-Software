import React from "react";
import TotalSales from "../../components/Admin/AdminDashboard/TotalSales";
import TotalOrders from "../../components/Admin/AdminDashboard/TotalOrders";
import TotalEmployees from "../../components/Admin/AdminDashboard/TotalEmployees";
import DueAmount from "../../components/Admin/AdminDashboard/DueAmount";
import AdvancedCollected from "../../components/Admin/AdminDashboard/AdvancedCollected";
import WeeklySales from "../../components/Admin/AdminDashboard/WeeklySales";
import AdvanceVsDue from "../../components/Admin/AdminDashboard/AdvanceVsDue";
import RateChart from "../../components/Admin/AdminDashboard/RateChart";
import ActiveEmployees from "../../components/Admin/AdminDashboard/ActiveEmployees";
import RecentOrdersTable from "../../components/Admin/AdminDashboard/RecentOrdersTable";
import TopSalesman from "../../components/Admin/AdminDashboard/TopSalesman";

const AdminDashboardPage = () => {
  return (
    <div>
      <h1 className="lg:text-3xl lg:font-bold mb-5">Dashboard</h1>
      <div className="grid lg:grid-cols-3 lg:gap-7 lg:mt-3">
        <TotalSales />
        <AdvancedCollected />
        <TotalOrders />
        <TotalEmployees />
        <ActiveEmployees />
        <DueAmount />
      </div>
      <div className="my-7 grid lg:grid-cols-2 gap-7">
        <WeeklySales />
        <AdvanceVsDue />
      </div>
      <div className="my-7 grid lg:grid-cols-2 gap-7">
        <RateChart />
        <TopSalesman />
      </div>

      <div className="my-7">
        <RecentOrdersTable />
      </div>
    </div>
  );
};

export default AdminDashboardPage;
