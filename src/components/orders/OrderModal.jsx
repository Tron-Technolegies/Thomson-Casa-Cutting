import React, { useState, useEffect } from "react";
import { MdClose } from "react-icons/md";
import { api } from "../../services/api";

export default function OrderModal({ isOpen, onClose, order, onUpdate }) {
  const [formData, setFormData] = useState({
    status: "Ready",
    cutting_notes: "",
    items: []
  });

  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (order) {
      const orderItems = order.items
        ? JSON.parse(JSON.stringify(order.items))
        : [];

      setFormData({
        status: order.status || "Ready",
        cutting_notes: order.cutting_notes || "",
        items: orderItems
      });
    }
  }, [order]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items];

    newItems[index] = {
      ...newItems[index],
      [field]: value
    };

    setFormData((prev) => ({
      ...prev,
      items: newItems
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!order || !order.id) return;

    setIsUpdating(true);

    try {
      // Send only fields that Cutting Team is allowed to modify.
      // Waste is calculated by backend.
      const payload = {
        status: formData.status,
        cutting_notes: formData.cutting_notes,

        items: formData.items.map((item) => ({
          id: item.id,
          received_quantity: item.received_quantity || "",
          meat_delivered: item.meat_delivered || ""
        }))
      };

      await api.put(
        `/cutting/orders/${order.id}/`,
        payload
      );

      if (onUpdate) {
        onUpdate();
      }
    } catch (error) {
      console.error("Failed to update order", error);

      const message =
        error?.response?.data?.message ||
        "Failed to update order";

      alert(message);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Background */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white w-full max-w-md rounded-2xl shadow-xl p-8 z-10 animate-in fade-in zoom-in-95 duration-200">

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <MdClose size={24} />
        </button>

        <form
          onSubmit={handleSubmit}
          className="space-y-5 max-h-[80vh] overflow-y-auto px-1 pb-2"
        >

          {/* -------------------------------- */}
          {/* Order Details */}
          {/* -------------------------------- */}

          <div className="grid grid-cols-2 gap-4">

            <div>
              <label className="block text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">
                Order Number
              </label>

              <div className="font-medium text-gray-900 bg-gray-50 px-3 py-2 rounded-lg border border-gray-100">
                {order?.id || "-"}
              </div>
            </div>

            <div>
              <label className="block text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">
                Customer
              </label>

              <div className="font-medium text-gray-900 bg-gray-50 px-3 py-2 rounded-lg border border-gray-100 truncate">
                {order?.customer || "-"}
              </div>
            </div>

            <div>
              <label className="block text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">
                Type
              </label>

              <div className="font-medium text-gray-900 bg-gray-50 px-3 py-2 rounded-lg border border-gray-100">
                {order?.type || "-"}
              </div>
            </div>

            <div>
              <label className="block text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">
                Weight Ordered
              </label>

              <div className="font-medium text-gray-900 bg-gray-50 px-3 py-2 rounded-lg border border-gray-100">
                {order?.weight || "0"} kg
              </div>
            </div>

          </div>

          <hr className="border-gray-100" />

          {/* -------------------------------- */}
          {/* Cutting Tracking */}
          {/* -------------------------------- */}

          <div className="space-y-4">

            <h3 className="font-semibold text-gray-800 text-sm uppercase tracking-wide">
              Category-Wise Cutting & Yield Tracking
            </h3>

            {formData.items.length === 0 && (
              <div className="text-sm text-gray-500 italic p-4 bg-gray-50 rounded-xl text-center">
                No categories found for this order.
              </div>
            )}

            {formData.items.map((item, index) => {

              const received = parseFloat(
                item.received_quantity
              );

              const meat = parseFloat(
                item.meat_delivered
              );

              const approxYield = parseFloat(
                item.approx_yield_percentage
              );

              const validReceived =
                !isNaN(received) && received > 0;

              const validMeat =
                !isNaN(meat) && meat >= 0;

              const validYield =
                !isNaN(approxYield) && approxYield > 0;

              // Expected Meat
              const expectedMeat =
                validReceived && validYield
                  ? (received * approxYield) / 100
                  : null;

              // Actual Yield
              const actualYield =
                validReceived && validMeat
                  ? (meat / received) * 100
                  : null;

              // Waste
              const waste =
                validReceived && validMeat
                  ? received - meat
                  : null;

              return (
                <div
                  key={item.id || index}
                  className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-4"
                >

                  {/* Category Header */}
                  <div className="flex justify-between items-center border-b border-gray-200 pb-2">

                    <span className="font-bold text-gray-800">
                      {item.chicken_type}
                    </span>

                    <span className="text-xs font-semibold text-gray-500 bg-white px-2 py-1 rounded shadow-sm border border-gray-200">
                      Ordered: {item.weight} kg
                    </span>

                  </div>

                  {/* Approx Yield */}
                  <div className="grid grid-cols-2 gap-3">

                    <div className="bg-white rounded-lg border border-gray-200 p-3">
                      <div className="text-xs text-gray-500">
                        Approx. Yield
                      </div>

                      <div className="text-lg font-bold text-[#465C8F]">
                        {validYield
                          ? `${approxYield.toFixed(2)}%`
                          : "—"}
                      </div>
                    </div>

                    <div className="bg-white rounded-lg border border-gray-200 p-3">
                      <div className="text-xs text-gray-500">
                        Expected Meat
                      </div>

                      <div className="text-lg font-bold text-gray-800">
                        {expectedMeat !== null
                          ? `${expectedMeat.toFixed(2)} kg`
                          : "—"}
                      </div>
                    </div>

                  </div>

                  {/* Raw Received */}
                  <div>
                    <label className="block text-gray-700 text-xs font-medium mb-1">
                      Raw / Live Received (kg)
                    </label>

                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="e.g. 50"
                      value={item.received_quantity ?? ""}
                      onChange={(e) =>
                        handleItemChange(
                          index,
                          "received_quantity",
                          e.target.value
                        )
                      }
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-gray-700 outline-none focus:border-[#465C8F] transition-all text-sm"
                    />
                  </div>

                  {/* Actual Meat */}
                  <div>
                    <label className="block text-gray-700 text-xs font-medium mb-1">
                      Actual Meat (kg)
                    </label>

                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="e.g. 35"
                      value={item.meat_delivered ?? ""}
                      onChange={(e) =>
                        handleItemChange(
                          index,
                          "meat_delivered",
                          e.target.value
                        )
                      }
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-gray-700 outline-none focus:border-[#465C8F] transition-all text-sm"
                    />
                  </div>

                  {/* Results */}
                  <div className="grid grid-cols-2 gap-3">

                    {/* Actual Yield */}
                    <div className="bg-white rounded-lg border border-gray-200 p-3">
                      <div className="text-xs text-gray-500">
                        Actual Yield
                      </div>

                      <div className="text-lg font-bold text-green-600">
                        {actualYield !== null
                          ? `${actualYield.toFixed(2)}%`
                          : "—"}
                      </div>
                    </div>

                    {/* Waste */}
                    <div className="bg-white rounded-lg border border-gray-200 p-3">
                      <div className="text-xs text-gray-500">
                        Waste
                      </div>

                      <div className="text-lg font-bold text-red-500">
                        {waste !== null
                          ? `${waste.toFixed(2)} kg`
                          : "—"}
                      </div>
                    </div>

                  </div>

                </div>
              );
            })}

            {/* -------------------------------- */}
            {/* Cutting Notes */}
            {/* -------------------------------- */}

            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1">
                Cutting Notes / Remarks
              </label>

              <textarea
                name="cutting_notes"
                rows="2"
                placeholder="Any issues or specific details?"
                value={formData.cutting_notes}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-xl px-4 py-2 text-gray-700 outline-none focus:border-[#465C8F] focus:ring-1 focus:ring-[#465C8F] transition-all resize-none"
              />
            </div>

          </div>

          <hr className="border-gray-100" />

          {/* -------------------------------- */}
          {/* Status */}
          {/* -------------------------------- */}

          <div>

            <label className="block text-gray-700 text-sm font-medium mb-2">
              Order Status
            </label>

            <div className="relative">

              <select
                name="status"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-700 outline-none focus:border-[#465C8F] transition-colors appearance-none bg-white"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="Pending">
                  Pending
                </option>

                <option value="Cutting">
                  Cutting
                </option>

                <option value="Ready">
                  Ready
                </option>
              </select>

              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>

            </div>

          </div>

          {/* -------------------------------- */}
          {/* Save */}
          {/* -------------------------------- */}

          <div className="pt-4 border-t border-gray-100">

            <button
              type="submit"
              disabled={isUpdating}
              className="w-full bg-[#465C8F] text-white py-3 rounded-xl font-semibold hover:bg-indigo-800 transition-colors disabled:opacity-70 flex justify-center items-center gap-2"
            >

              {isUpdating ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}

            </button>

          </div>

        </form>
      </div>
    </div>
  );
}