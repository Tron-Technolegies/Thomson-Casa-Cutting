import React from "react";
import { Route, Routes } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Dashboard from "./pages/Dashboard";
import CuttingOrders from "./pages/CuttingOrders";
import Notification from "./pages/Notification";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import Login from "./pages/Login";

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route element={<ProtectedRoute allowedRoles={['admin', 'cutting']} />}>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="cutting-orders" element={<CuttingOrders/>} />
            <Route path="notification" element={<Notification />} />
          </Route>
        </Route>
      </Routes>
    </AuthProvider>
  );
}
