import React from "react";
import { MdClose } from "react-icons/md";

export default function OrderModal({ isOpen, onClose, order }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-white w-full max-w-md rounded-2xl shadow-xl p-8 z-10 animate-in fade-in zoom-in-95 duration-200">
        <div className="space-y-6">
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-2">Order Number</label>
            <input
              type="text"
              readOnly
              value={order?.id || ""}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-700 bg-gray-50/50 outline-none focus:border-gray-300 transition-colors"
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-medium mb-2">Customer Name</label>
            <input
              type="text"
              readOnly
              value={order?.customer || ""}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-700 bg-gray-50/50 outline-none focus:border-gray-300 transition-colors"
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-medium mb-2">Chicken Type</label>
            <input
              type="text"
              readOnly
              value={order?.type || ""}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-700 bg-gray-50/50 outline-none focus:border-gray-300 transition-colors"
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-medium mb-2">Weight</label>
            <input
              type="text"
              readOnly
              value={order?.weight || ""}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-700 bg-gray-50/50 outline-none focus:border-gray-300 transition-colors"
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-medium mb-2">Status</label>
            <select
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-700 outline-none focus:border-gray-300 transition-colors appearance-none bg-white"
              defaultValue={order?.status || "Ready"}
            >
              <option value="Ready">Ready</option>
              <option value="Cutting">Cutting</option>
              <option value="Pending">Pending</option>
            </select>
            {/* Custom dropdown arrow */}
            <div className="absolute right-12 bottom-12 pointer-events-none text-gray-500">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
