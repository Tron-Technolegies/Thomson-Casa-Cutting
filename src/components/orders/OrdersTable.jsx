import React from "react";
import { FiEye, FiEdit2 } from "react-icons/fi";

const getStatusBadge = (status) => {
  switch (status.toLowerCase()) {
    case "ready":
      return <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">Ready</span>;
    case "cutting":
      return <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">Cutting</span>;
    case "pending":
      return <span className="px-3 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded-full">Pending</span>;
    default:
      return <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">{status}</span>;
  }
};

export default function OrdersTable({ orders, onActionClick, actionType = "view" }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-100 text-xs text-gray-500 font-semibold uppercase tracking-wider">
              <th className="px-6 py-4">Order</th>
              <th className="px-6 py-4">Customer</th>
              <th className="px-6 py-4">Type</th>
              <th className="px-6 py-4">Weight</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 text-sm">
            {orders.map((order, index) => (
              <tr key={index} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4 font-medium text-gray-900">{order.id}</td>
                <td className="px-6 py-4 text-gray-700">{order.customer}</td>
                <td className="px-6 py-4 text-gray-700">{order.type}</td>
                <td className="px-6 py-4 text-gray-700">{order.weight}</td>
                <td className="px-6 py-4">{getStatusBadge(order.status)}</td>
                <td className="px-6 py-4 flex justify-center">
                  <button
                    onClick={() => onActionClick && onActionClick(order)}
                    className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    {actionType === "view" ? <FiEye size={18} /> : <FiEdit2 size={18} />}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
