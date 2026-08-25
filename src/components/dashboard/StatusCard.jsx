import React from "react";

export default function StatusCard({ title, value, dotColor, bgColor }) {
  return (
    <div className={`${bgColor} p-6 rounded-2xl flex flex-col items-start gap-4 border border-opacity-50 border-gray-200`}>
      <div className="flex items-center gap-2">
        <div className={`w-2.5 h-2.5 rounded-full ${dotColor}`} />
        <span className="text-gray-600 font-medium">{title}</span>
      </div>
      <div>
        <h3 className="text-3xl font-bold text-gray-800 mb-1">{value}</h3>
        <p className="text-gray-500">Orders</p>
      </div>
    </div>
  );
}
