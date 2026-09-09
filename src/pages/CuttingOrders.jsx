import React, { useState, useEffect } from "react";
import { FiCalendar } from "react-icons/fi";
import OrdersTable from "../components/orders/OrdersTable";
import OrderModal from "../components/orders/OrderModal";
import CreateOrderModal from "../components/orders/CreateOrderModal";
import { api } from "../services/api";

export default function CuttingOrders() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await api.get('/cutting/orders/');
      setOrders(response.data);
    } catch (error) {
      console.error("Failed to fetch cutting orders", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleEditClick = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleStatusUpdate = () => {
    setIsModalOpen(false);
    fetchOrders(); // Refresh table after update
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Cutting Team</h1>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors shadow-sm">
            <FiCalendar />
            <span className="font-medium">{new Date().toLocaleDateString('en-GB')}</span>
          </button>
          <button 
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-[#465C8F] text-white px-5 py-2 rounded-xl font-semibold hover:bg-indigo-800 transition shadow-sm"
          >
            Create Order +
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        {loading ? (
          <div className="text-center py-8 text-gray-500">Loading orders...</div>
        ) : (
          <OrdersTable 
            orders={orders} 
            onActionClick={handleEditClick} 
            actionType="edit" 
          />
        )}
      </div>

      <OrderModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        order={selectedOrder} 
        onUpdate={handleStatusUpdate}
      />
      
      <CreateOrderModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
        onSuccess={fetchOrders}
      />
    </div>
  );
}
