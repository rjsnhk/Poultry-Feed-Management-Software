import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AdminDashboardPage from "./pages/Admin/AdminDashboardPage";
import MainLayout from "./layouts/MainLayout";
import LoginPage from "./pages/Login/LoginPage";
import SalesmanDashboardPage from "./pages/Salesman/SalesmanDashboardPage";
import ProductManagementPage from "./pages/Admin/ProductManagementPage";
import EmployeeManagementPage from "./pages/Admin/EmployeeManagementPage";
import { Toaster } from "react-hot-toast";
import OrderManagementPage from "./pages/Admin/OrderManagementPage";
import WarehouseManagementPage from "./pages/Admin/WarehouseManagementPage";
import ProtectedRoutes from "./ui/ProtectedRoutes";
import SalesAuthorizerDashboardPage from "./pages/SalesAuthorizer/SalesAuthorizerDashboardPage";
import SalesManagerDashboardPage from "./pages/SalesManager/SalesManagerDashboardPage";
import PlantheadDashboardPage from "./pages/Planthead/PlantheadDashboardPage";
import AccoutantDashboardPage from "./pages/Accountant/AccoutantDashboardPage";

const App = () => {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoutes>
                <MainLayout />
              </ProtectedRoutes>
            }
          >
            {/* Admin routes*/}
            <Route path="admin">
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboardPage />} />
              <Route
                path="product-management"
                element={<ProductManagementPage />}
              />
              <Route
                path="employee-management"
                element={<EmployeeManagementPage />}
              />
              <Route
                path="order-management"
                element={<OrderManagementPage />}
              />
              <Route
                path="warehouse-management"
                element={<WarehouseManagementPage />}
              />
              <Route path="party-master" element={<AdminDashboardPage />} />
              <Route path="reports-module" element={<AdminDashboardPage />} />
              <Route
                path="settings-security"
                element={<AdminDashboardPage />}
              />
            </Route>

            {/* Salesman routes */}
            <Route path="salesman">
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<SalesmanDashboardPage />} />
            </Route>

            {/* Sales Manager routes */}
            <Route path="salesmanager">
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<SalesManagerDashboardPage />} />
            </Route>

            {/* Sales Authorizer routes */}
            <Route path="salesauthorizer">
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route
                path="dashboard"
                element={<SalesAuthorizerDashboardPage />}
              />
            </Route>

            {/* Plant Head routes */}
            <Route path="planthead">
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<PlantheadDashboardPage />} />
            </Route>

            {/* Accountant routes */}
            <Route path="accountant">
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<AccoutantDashboardPage />} />
            </Route>
          </Route>

          {/* Login route */}
          <Route path="/login" element={<LoginPage />} />
        </Routes>
        <Toaster />
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
