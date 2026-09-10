import React, { useState, useMemo } from "react";
import { FiEye, FiEdit2, FiChevronLeft, FiChevronRight } from "react-icons/fi";

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

export default function OrdersTable({ orders, search = "", activeTab = "All", onActionClick, actionType = "view" }) {
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const matchesSearch = 
        (order.id && order.id.toLowerCase().includes(search.toLowerCase())) ||
        (order.customer && order.customer.toLowerCase().includes(search.toLowerCase()));
      
      const matchesTab = activeTab === "All" || order.status === activeTab;
      
      return matchesSearch && matchesTab;
    });
  }, [orders, search, activeTab]);

  const totalPages = Math.ceil(filteredOrders.length / rowsPerPage);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  // Reset to page 1 if filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [search, activeTab, orders.length]);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col">
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
            {paginatedOrders.length > 0 ? (
              paginatedOrders.map((order, index) => (
                <tr 
                  key={index} 
                  className="hover:bg-gray-50/50 transition-colors cursor-pointer"
                  onClick={() => onActionClick && onActionClick(order)}
                >
                  <td className="px-6 py-4 font-medium text-gray-900">{order.id}</td>
                  <td className="px-6 py-4 text-gray-700">{order.customer}</td>
                  <td className="px-6 py-4 text-gray-700">{order.type}</td>
                  <td className="px-6 py-4 text-gray-700">{order.weight}</td>
                  <td className="px-6 py-4">{getStatusBadge(order.status)}</td>
                  <td className="px-6 py-4 flex justify-center" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => onActionClick && onActionClick(order)}
                      className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      {actionType === "view" ? <FiEye size={18} /> : <FiEdit2 size={18} />}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
          <span className="text-sm text-gray-500">
            Showing <span className="font-medium text-gray-900">{((currentPage - 1) * rowsPerPage) + 1}</span> to <span className="font-medium text-gray-900">{Math.min(currentPage * rowsPerPage, filteredOrders.length)}</span> of <span className="font-medium text-gray-900">{filteredOrders.length}</span> orders
          </span>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:hover:bg-transparent transition-colors"
            >
              <FiChevronLeft className="text-gray-600" />
            </button>
            
            <div className="flex gap-1">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                    currentPage === i + 1 
                      ? 'bg-[#465C8F] text-white' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            <button 
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:hover:bg-transparent transition-colors"
            >
              <FiChevronRight className="text-gray-600" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
