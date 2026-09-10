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
  
  // Filter & Pagination States
  const [activeTab, setActiveTab] = useState("All");
  const [dateFilter, setDateFilter] = useState("");
  const [search, setSearch] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterRef = React.useRef(null);

  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setIsFilterOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const query = new URLSearchParams();
      if (dateFilter) query.append("date", dateFilter);
      
      const response = await api.get(`/cutting/orders/?${query.toString()}`);
      setOrders(response.data);
    } catch (error) {
      console.error("Failed to fetch cutting orders", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [dateFilter]);

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
          <button 
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-[#465C8F] text-white px-5 py-2 rounded-xl font-semibold hover:bg-indigo-800 transition shadow-sm"
          >
            Create Order +
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        {/* Filters */}
        <div className="pb-6 border-b border-gray-100 mb-6 flex gap-4 items-center flex-wrap">
          <div className="flex-1 flex items-center bg-[#F7F7F7] border border-[#00000026] rounded-xl px-4 py-3 min-w-[250px] max-w-2xl">
            <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 mr-2" height="20" width="20" xmlns="http://www.w3.org/2000/svg"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            <input 
              type="text" 
              placeholder="Search Orders..." 
              className="bg-transparent w-full outline-none text-gray-700"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-4 ml-auto relative" ref={filterRef}>
            <button 
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl border font-medium transition ${isFilterOpen ? 'bg-[#465C8F] text-white border-[#465C8F]' : 'bg-white border-[#00000026] text-gray-700 hover:bg-gray-50'}`}
            >
              <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="20" width="20" xmlns="http://www.w3.org/2000/svg"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
              Filters
              <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </button>

            {isFilterOpen && (
              <div className="absolute top-full right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-gray-100 p-5 z-20 max-h-[70vh] overflow-y-auto">
                <div className="space-y-5">
                  
                  {/* Status Filter */}
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Status</label>
                    <select 
                      className="w-full border border-gray-200 bg-gray-50 rounded-xl px-3 py-2 outline-none text-gray-700 text-sm focus:border-[#465C8F]"
                      value={activeTab}
                      onChange={(e) => setActiveTab(e.target.value)}
                    >
                      <option value="All">All Status</option>
                      <option value="Pending">Pending</option>
                      <option value="Cutting">Cutting</option>
                      <option value="Ready">Ready</option>
                    </select>
                  </div>

                  {/* Date Filter */}
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Date</label>
                    <input 
                      type="date"
                      className="w-full border border-gray-200 bg-gray-50 rounded-xl px-3 py-2 outline-none text-gray-700 text-sm focus:border-[#465C8F]"
                      value={dateFilter}
                      onChange={(e) => setDateFilter(e.target.value)}
                    />
                  </div>

                  {/* Clear Button */}
                  <div className="pt-2 border-t border-gray-100">
                    <button
                      onClick={() => {
                        setActiveTab('All');
                        setDateFilter('');
                        setIsFilterOpen(false);
                      }}
                      className="w-full py-2 text-sm font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition"
                    >
                      Clear Filters
                    </button>
                  </div>

                </div>
              </div>
            )}
          </div>
        </div>
        {loading ? (
          <div className="text-center py-8 text-gray-500">Loading orders...</div>
        ) : (
          <OrdersTable 
            orders={orders} 
            search={search}
            activeTab={activeTab}
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
