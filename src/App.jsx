import React from "react";
import { Route, Routes } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Dashboard from "./pages/Dashboard";
import CuttingOrders from "./pages/CuttingOrders";
import Notification from "./pages/Notification";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="cutting-orders" element={<CuttingOrders/>} />
        <Route path="notification" element={<Notification />} />
      </Route>
    </Routes>
  );
}
