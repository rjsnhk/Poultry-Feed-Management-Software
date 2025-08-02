import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AdminDashboardPage from "./pages/Admin/AdminDashboardPage";
import MainLayout from "./layouts/MainLayout";
import LoginPage from "./pages/Login/LoginPage";
import SalesmanDashboard from "./pages/Salesman/SalesmanDashboard";
import ProductManagementPage from "./pages/Admin/ProductManagementPage";
import EmployeeManagementPage from "./pages/Admin/EmployeeManagementPage";
import { Toaster } from "react-hot-toast";
import OrderManagementPage from "./pages/Admin/OrderManagementPage";
import WarehouseManagementPage from "./pages/Admin/WarehouseManagementPage";

const App = () => {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
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
              <Route path="dashboard" element={<SalesmanDashboard />} />
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
