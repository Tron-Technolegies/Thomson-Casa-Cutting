import React, { useState } from "react";
import { FiCalendar } from "react-icons/fi";
import OrdersTable from "../components/orders/OrdersTable";
import OrderModal from "../components/orders/OrderModal";

const cuttingOrdersData = [
  { id: "ORD-2026-0183", customer: "Raj Foods Pvt Ltd", type: "Dressed Chicken", weight: "250 Kg", status: "Ready" },
  { id: "ORD-2026-0183", customer: "Fresh Mart", type: "Full Chicken", weight: "150 Kg", status: "Cutting" },
  { id: "ORD-2026-0183", customer: "Splyzone Pvt Ltd", type: "Dressed Chicken", weight: "150 Kg", status: "Ready" },
  { id: "ORD-2026-0183", customer: "Local Eatery", type: "Chicken Wings", weight: "50 Kg", status: "Pending" },
  { id: "ORD-2026-0183", customer: "Grill House", type: "Boneless Breast", weight: "100 Kg", status: "Pending" },
  { id: "ORD-2026-0183", customer: "Daily Mart", type: "Dressed Chicken", weight: "200 Kg", status: "Cutting" },
];

export default function CuttingOrders() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const handleEditClick = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Cutting Team</h1>
        
        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors shadow-sm">
          <FiCalendar />
          <span className="font-medium">20/10/2026</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <OrdersTable 
          orders={cuttingOrdersData} 
          onActionClick={handleEditClick} 
          actionType="edit" 
        />
      </div>

      <OrderModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        order={selectedOrder} 
      />
    </div>
  );
}
