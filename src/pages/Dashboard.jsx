import React, { useState, useEffect } from "react";
import { FiShoppingCart, FiClock, FiCheckCircle } from "react-icons/fi";
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
    recent_orders: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await api.get('/cutting/dashboard/');
        setData(response.data);
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading dashboard...</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Cutting Team</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-gray-800">Recent Orders</h2>
          <button className="text-sm font-medium text-blue-600 hover:text-blue-700">
            View All Orders
          </button>
        </div>
        <OrdersTable orders={data.recent_orders} actionType="view" />
      </div>
    </div>
  );
}
