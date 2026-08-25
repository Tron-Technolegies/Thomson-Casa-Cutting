import React from "react";
import { FiShoppingCart, FiClock, FiCheckCircle } from "react-icons/fi";
import StatCard from "../components/dashboard/StatCard";
import StatusCard from "../components/dashboard/StatusCard";
import OrdersTable from "../components/orders/OrdersTable";

const recentOrders = [
  { id: "ORD-2026-0183", customer: "Raj Foods Pvt Ltd", type: "Dressed Chicken", weight: "250 Kg", status: "Ready" },
  { id: "ORD-2026-0183", customer: "Fresh Mart", type: "Full Chicken", weight: "150 Kg", status: "Cutting" },
  { id: "ORD-2026-0183", customer: "Splyzone Pvt Ltd", type: "Dressed Chicken", weight: "150 Kg", status: "Ready" },
];

export default function Dashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Cutting Team</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            title="Today's Orders"
            value="37"
            icon={FiShoppingCart}
            iconColor="text-green-600"
            iconBg="bg-green-100"
          />
          <StatCard
            title="Pending Orders"
            value="8"
            icon={FiClock}
            iconColor="text-orange-500"
            iconBg="bg-orange-100"
          />
          <StatCard
            title="Completed"
            value="29"
            icon={FiCheckCircle}
            iconColor="text-green-600"
            iconBg="bg-green-100"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatusCard
          title="Pending"
          value="5"
          dotColor="bg-yellow-400"
          bgColor="bg-orange-50/50"
        />
        <StatusCard
          title="In Progress"
          value="3"
          dotColor="bg-blue-400"
          bgColor="bg-blue-50/50"
        />
        <StatusCard
          title="Completed"
          value="29"
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
        <OrdersTable orders={recentOrders} actionType="view" />
      </div>
    </div>
  );
}
