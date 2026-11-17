
import React, { useState, useEffect } from "react";
import {
  FiShoppingCart,
  FiClock,
  FiCheckCircle,
} from "react-icons/fi";

import StatCard from "../components/dashboard/StatCard";
import StatusCard from "../components/dashboard/StatusCard";
import OrdersTable from "../components/orders/OrdersTable";
import { api } from "../services/api";

export default function Dashboard() {
  const [data, setData] = useState({
    today_orders_count: 0,
    pending_count: 0,
    cutting_count: 0,
    ready_count: 0,
    recent_orders: [],
  });

  const [loading, setLoading] = useState(true);

  // Existing dashboard API functionality
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await api.get("/cutting/dashboard/");

        setData(response.data);
      } catch (error) {
        console.error(
          "Failed to fetch dashboard data",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="w-full min-w-0 px-4 sm:px-6 py-10 text-center text-sm text-gray-500">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="w-full min-w-0 max-w-full space-y-5 sm:space-y-6 lg:space-y-8">

      {/* PAGE HEADING */}
      <div>
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-5 sm:mb-6">
          Cutting Team
        </h1>

        {/* MAIN STAT CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
          <StatCard
            title="Today's Orders"
            value={data.today_orders_count}
            icon={FiShoppingCart}
            iconColor="text-green-600"
            iconBg="bg-green-100"
          />

          <StatCard
            title="Pending Orders"
            value={data.pending_count}
            icon={FiClock}
            iconColor="text-orange-500"
            iconBg="bg-orange-100"
          />

          <StatCard
            title="Completed"
            value={data.ready_count}
            icon={FiCheckCircle}
            iconColor="text-green-600"
            iconBg="bg-green-100"
          />
        </div>
      </div>

      {/* ORDER STATUS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
        <StatusCard
          title="Pending"
          value={data.pending_count}
          dotColor="bg-yellow-400"
          bgColor="bg-orange-50/50"
        />

        <StatusCard
          title="In Progress"
          value={data.cutting_count}
          dotColor="bg-blue-400"
          bgColor="bg-blue-50/50"
        />

        <StatusCard
          title="Completed"
          value={data.ready_count}
          dotColor="bg-green-400"
          bgColor="bg-green-50/50"
        />
      </div>

      {/* RECENT ORDERS */}
      <div className="w-full min-w-0 bg-white rounded-2xl shadow-sm border border-gray-100 p-3 sm:p-4 lg:p-6">

        <div className="flex items-center justify-between mb-4 sm:mb-6 px-1">
          <h2 className="text-base sm:text-lg font-bold text-gray-800">
            Recent Orders
          </h2>

          {/* View All Orders button removed */}
        </div>

        {/* Eye/View action removed only from Dashboard */}
        <OrdersTable
          orders={data.recent_orders || []}
          hideActions={true}
        />
      </div>
    </div>
  );
}
