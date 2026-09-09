import React, { useState, useEffect } from 'react';
import { FiChevronDown, FiPlus, FiTrash2 } from 'react-icons/fi';
import { api } from '../../services/api';

export default function CreateOrderModal({ isOpen, onClose, onSuccess }) {
  const [customers, setCustomers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    customer_id: "",
    delivery_date: "",
    status: "Pending",
    notes: "",
    items: [{ chicken_type: "", weight: "" }]
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      fetchCustomers();
      fetchCategories();
    }
  }, [isOpen]);

  const fetchCustomers = async () => {
    try {
      const response = await api.get('/admin/customers/');
      if (response.success) {
        setCustomers(response.customers);
        if (response.customers.length > 0) {
          setFormData(prev => ({ ...prev, customer_id: response.customers[0].id }));
        }
      }
    } catch (err) {
      console.error("Failed to load customers:", err);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get('/admin/categories/');
      if (response.success && response.categories.length > 0) {
        setCategories(response.categories);
        setFormData(prev => ({
          ...prev,
          items: [{ chicken_type: response.categories[0].name, weight: "" }]
        }));
      }
    } catch (err) {
      console.error("Failed to load categories:", err);
    }
  };

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index][field] = value;
    setFormData({ ...formData, items: newItems });
  };

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { chicken_type: categories.length > 0 ? categories[0].name : "", weight: "" }]
    });
  };

  const removeItem = (index) => {
    if (formData.items.length > 1) {
      const newItems = formData.items.filter((_, i) => i !== index);
      setFormData({ ...formData, items: newItems });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validate items
    for (let i = 0; i < formData.items.length; i++) {
      const item = formData.items[i];
      if (!item.chicken_type) {
        setError(`Item ${i + 1} must have a chicken type.`);
        return;
      }
      if (!item.weight || Number(item.weight) <= 0) {
        setError(`Item ${i + 1} must have a weight greater than 0.`);
        return;
      }
    }

    setLoading(true);
    try {
      const response = await api.post("/admin/orders/add/", formData);
      if (response.success) {
        if (onSuccess) onSuccess();
        setFormData({
          customer_id: customers.length > 0 ? customers[0].id : "",
          delivery_date: "",
          status: "Pending",
          notes: "",
          items: [{ chicken_type: categories.length > 0 ? categories[0].name : "", weight: "" }]
        });
        onClose();
      } else {
        setError(response.message || "Failed to create order.");
      }
    } catch (err) {
      setError(err.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-3xl bg-white shadow-2xl">
        {/* Header */}
        <div className="px-8 py-4 flex justify-between items-center border-b border-gray-100 mb-4">
          <h2 className="text-xl font-bold text-gray-900">
            Create Order
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-900 transition">
            <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="24" width="24" xmlns="http://www.w3.org/2000/svg"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 pt-2">
          {error && <div className="mb-4 text-red-500 text-sm font-semibold">{error}</div>}
          
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
            <p className="text-sm text-blue-800">
              <strong>Notice:</strong> If the customer is new, please inform Admin or Accounts to create the new customer profile first. The order can then be associated with the newly created customer.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            
            {/* Customer Name */}
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-gray-600">
                Customer Name
              </label>
              <div className="relative">
                <select 
                  name="customer_id"
                  value={formData.customer_id}
                  onChange={handleChange}
                  className="h-13 w-full appearance-none rounded-2xl border border-gray-300 px-5 outline-none focus:border-[#4B5EAA] bg-white"
                  required
                >
                  {customers.map(c => (
                    <option key={c.id} value={c.id}>{c.customer_name}</option>
                  ))}
                </select>
                <FiChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-500" />
              </div>
            </div>

            {/* Delivery Date */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-600">
                Delivery Date
              </label>
              <input
                type="date"
                name="delivery_date"
                value={formData.delivery_date}
                onChange={handleChange}
                className="h-13 w-full rounded-2xl border border-gray-300 px-5 outline-none focus:border-[#4B5EAA]"
                required
              />
            </div>

            {/* Status */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-600">
                Status
              </label>
              <div className="relative">
                <select 
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="h-13 w-full appearance-none rounded-2xl border border-gray-300 px-5 outline-none focus:border-[#4B5EAA] bg-white"
                >
                  <option value="Delivered">Delivered</option>
                  <option value="Pending">Pending</option>
                  <option value="Ready">Ready</option>
                  <option value="Cutting">Cutting</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
                <FiChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-500" />
              </div>
            </div>

            {/* Order Items */}
            <div className="md:col-span-2 mt-2">
              <div className="flex justify-between items-center mb-3">
                <label className="block text-sm font-medium text-gray-600">
                  Order Items
                </label>
                <button
                  type="button"
                  onClick={addItem}
                  className="text-sm font-semibold text-[#4B5EAA] hover:text-[#3d4f92] flex items-center gap-1 transition"
                >
                  <FiPlus /> Add Item
                </button>
              </div>
              
              <div className="space-y-4">
                {formData.items.map((item, index) => (
                  <div key={index} className="flex flex-col sm:flex-row gap-4 items-start sm:items-center bg-gray-50 p-4 rounded-2xl border border-gray-100">
                    <div className="flex-1 w-full relative">
                      <label className="mb-1 block text-xs font-medium text-gray-500">Chicken Type</label>
                      <select 
                        value={item.chicken_type}
                        onChange={(e) => handleItemChange(index, "chicken_type", e.target.value)}
                        className="h-11 w-full appearance-none rounded-xl border border-gray-300 pl-3 pr-8 outline-none focus:border-[#4B5EAA] bg-white text-sm"
                        required
                      >
                        {categories.map(cat => (
                          <option key={cat.id} value={cat.name}>{cat.name}</option>
                        ))}
                      </select>
                      <FiChevronDown className="absolute right-3 top-8 text-gray-500" />
                    </div>
                    
                    <div className="w-full sm:w-1/3">
                      <label className="mb-1 block text-xs font-medium text-gray-500">Weight (Kg)</label>
                      <input
                        type="number"
                        value={item.weight}
                        onChange={(e) => handleItemChange(index, "weight", e.target.value)}
                        placeholder="0"
                        step="0.01"
                        className="h-11 w-full rounded-xl border border-gray-300 px-3 outline-none focus:border-[#4B5EAA] text-sm"
                        required
                      />
                    </div>
                    
                    {formData.items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeItem(index)}
                        className="mt-6 text-red-400 hover:text-red-600 p-2 transition"
                        title="Remove Item"
                      >
                        <FiTrash2 size={18} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-gray-600">
                Notes
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows="2"
                className="w-full rounded-2xl border border-gray-300 px-5 py-4 resize-none outline-none focus:border-[#4B5EAA]"
              />
            </div>

          </div>

          {/* Footer */}
          <div className="mt-8 flex flex-col-reverse gap-4 md:flex-row md:justify-center">
            <button
              type="button"
              onClick={onClose}
              className="w-full md:w-44 rounded-2xl border border-[#4B5EAA] py-3 font-semibold text-[#4B5EAA] transition hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="w-full md:w-44 rounded-2xl bg-[#4B5EAA] py-3 font-semibold text-white transition hover:bg-[#3d4f92] disabled:opacity-70"
            >
              {loading ? "Saving..." : "Save Order"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
