
import React, { useState, useMemo, useEffect } from "react";
import {
  FiEye,
  FiEdit2,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";

// Existing order status badges
const getStatusBadge = (status = "") => {
  switch (String(status).toLowerCase()) {
    case "ready":
      return (
        <span className="inline-flex px-3 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">
          Ready
        </span>
      );

    case "cutting":
      return (
        <span className="inline-flex px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
          Cutting
        </span>
      );

    case "pending":
      return (
        <span className="inline-flex px-3 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded-full">
          Pending
        </span>
      );

    default:
      return (
        <span className="inline-flex px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
          {status}
        </span>
      );
  }
};

export default function OrdersTable({
  orders = [],
  search = "",
  activeTab = "All",
  onActionClick,
  actionType = "view",
  hideActions = false,
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  // Keep existing search and tab filtering
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesSearch =
        (order.id &&
          String(order.id)
            .toLowerCase()
            .includes(search.toLowerCase())) ||
        (order.customer &&
          String(order.customer)
            .toLowerCase()
            .includes(search.toLowerCase()));

      const matchesTab =
        activeTab === "All" || order.status === activeTab;

      return matchesSearch && matchesTab;
    });
  }, [orders, search, activeTab]);

  const totalPages = Math.ceil(
    filteredOrders.length / rowsPerPage
  );

  const safeCurrentPage = Math.min(
    Math.max(currentPage, 1),
    Math.max(totalPages, 1)
  );

  const startIndex =
    (safeCurrentPage - 1) * rowsPerPage;

  const paginatedOrders = filteredOrders.slice(
    startIndex,
    startIndex + rowsPerPage
  );

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, activeTab, orders.length]);

  const showActions = !hideActions;

  const handleOrderClick = (order) => {
    if (showActions && onActionClick) {
      onActionClick(order);
    }
  };

  const actionButton = (order) => {
    if (!showActions) return null;

    return (
      <button
        type="button"
        aria-label={
          actionType === "view"
            ? `View order ${order.id}`
            : `Edit order ${order.id}`
        }
        onClick={(e) => {
          e.stopPropagation();
          handleOrderClick(order);
        }}
        className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
      >
        {actionType === "view" ? (
          <FiEye size={18} />
        ) : (
          <FiEdit2 size={18} />
        )}
      </button>
    );
  };

  return (
    <div className="w-full min-w-0 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

      {/* MOBILE: Card layout */}
      <div className="block md:hidden divide-y divide-gray-100">
        {paginatedOrders.length > 0 ? (
          paginatedOrders.map((order, index) => (
            <div
              key={order.id ?? index}
              onClick={() => handleOrderClick(order)}
              className={`p-4 sm:p-5 space-y-4 ${
                showActions && onActionClick
                  ? "cursor-pointer hover:bg-gray-50"
                  : ""
              }`}
            >
              {/* Order ID and status */}
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs text-gray-400 mb-1">
                    Order
                  </p>
                  <p className="font-semibold text-gray-900 text-sm break-words">
                    {order.id}
                  </p>
                </div>

                <div className="shrink-0">
                  {getStatusBadge(order.status)}
                </div>
              </div>

              {/* Customer and order details */}
              <div className="grid grid-cols-2 gap-x-3 gap-y-4">
                <div className="col-span-2 min-w-0">
                  <p className="text-xs text-gray-400 mb-1">
                    Customer
                  </p>
                  <p className="text-sm font-medium text-gray-800 break-words">
                    {order.customer || "—"}
                  </p>
                </div>

                <div className="min-w-0">
                  <p className="text-xs text-gray-400 mb-1">
                    Type
                  </p>
                  <p className="text-sm text-gray-700 break-words">
                    {order.type || "—"}
                  </p>
                </div>

                <div className="min-w-0">
                  <p className="text-xs text-gray-400 mb-1">
                    Weight
                  </p>
                  <p className="text-sm text-gray-700 font-medium break-words">
                    {order.weight ?? "—"}
                  </p>
                </div>
              </div>

              {/* Optional action for other pages */}
              {showActions && (
                <div className="flex justify-end border-t border-gray-100 pt-3">
                  {actionButton(order)}
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="px-4 py-10 text-center text-sm text-gray-500">
            No orders found.
          </div>
        )}
      </div>

      {/* TABLET / DESKTOP: Table layout */}
      <div className="hidden md:block w-full overflow-x-auto">
        <table className="w-full min-w-[680px] text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-100 text-xs text-gray-500 font-semibold uppercase tracking-wider">
              <th className="px-4 lg:px-6 py-4">
                Order
              </th>

              <th className="px-4 lg:px-6 py-4">
                Customer
              </th>

              <th className="px-4 lg:px-6 py-4">
                Type
              </th>

              <th className="px-4 lg:px-6 py-4">
                Weight
              </th>

              <th className="px-4 lg:px-6 py-4">
                Status
              </th>

              {showActions && (
                <th className="px-4 lg:px-6 py-4 text-center">
                  Action
                </th>
              )}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-50 text-sm">
            {paginatedOrders.length > 0 ? (
              paginatedOrders.map((order, index) => (
                <tr
                  key={order.id ?? index}
                  onClick={() => handleOrderClick(order)}
                  className={`transition-colors ${
                    showActions && onActionClick
                      ? "hover:bg-gray-50/50 cursor-pointer"
                      : "hover:bg-gray-50/30"
                  }`}
                >
                  <td className="px-4 lg:px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                    {order.id}
                  </td>

                  <td className="px-4 lg:px-6 py-4 text-gray-700">
                    <span className="break-words">
                      {order.customer}
                    </span>
                  </td>

                  <td className="px-4 lg:px-6 py-4 text-gray-700">
                    {order.type}
                  </td>

                  <td className="px-4 lg:px-6 py-4 text-gray-700 whitespace-nowrap">
                    {order.weight}
                  </td>

                  <td className="px-4 lg:px-6 py-4">
                    {getStatusBadge(order.status)}
                  </td>

                  {showActions && (
                    <td
                      className="px-4 lg:px-6 py-4 text-center"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex justify-center">
                        {actionButton(order)}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={showActions ? 6 : 5}
                  className="px-6 py-10 text-center text-gray-500"
                >
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="px-4 sm:px-6 py-4 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

          <span className="text-xs sm:text-sm text-gray-500 text-center sm:text-left">
            Showing{" "}
            <span className="font-medium text-gray-900">
              {startIndex + 1}
            </span>{" "}
            to{" "}
            <span className="font-medium text-gray-900">
              {Math.min(
                safeCurrentPage * rowsPerPage,
                filteredOrders.length
              )}
            </span>{" "}
            of{" "}
            <span className="font-medium text-gray-900">
              {filteredOrders.length}
            </span>{" "}
            orders
          </span>

          <div className="flex items-center justify-center sm:justify-end gap-2 min-w-0">
            <button
              type="button"
              aria-label="Previous page"
              onClick={() =>
                setCurrentPage((p) => Math.max(1, p - 1))
              }
              disabled={safeCurrentPage === 1}
              className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 transition-colors shrink-0"
            >
              <FiChevronLeft className="text-gray-600" />
            </button>

            {/* Page numbers scroll horizontally on small screens */}
            <div className="flex items-center gap-1 overflow-x-auto max-w-[190px] sm:max-w-[260px] lg:max-w-[400px] py-1">
              {Array.from(
                { length: totalPages },
                (_, index) => index + 1
              ).map((page) => (
                <button
                  key={page}
                  type="button"
                  onClick={() => setCurrentPage(page)}
                  aria-label={`Go to page ${page}`}
                  aria-current={
                    safeCurrentPage === page
                      ? "page"
                      : undefined
                  }
                  className={`w-8 h-8 shrink-0 rounded-lg text-sm font-medium transition-colors ${
                    safeCurrentPage === page
                      ? "bg-[#465C8F] text-white"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>

            <button
              type="button"
              aria-label="Next page"
              onClick={() =>
                setCurrentPage((p) =>
                  Math.min(totalPages, p + 1)
                )
              }
              disabled={safeCurrentPage === totalPages}
              className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 transition-colors shrink-0"
            >
              <FiChevronRight className="text-gray-600" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
