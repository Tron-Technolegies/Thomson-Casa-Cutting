import React from "react";

export default function StatCard({ title, value, icon: Icon, iconColor, iconBg }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-start gap-4">
      <div className={`p-2 rounded-lg ${iconBg} ${iconColor}`}>
        <Icon size={24} />
      </div>
      <div>
        <h3 className="text-3xl font-bold text-gray-800 mb-1">{value}</h3>
        <p className="text-gray-500 font-medium">{title}</p>
      </div>
    </div>
  );
}
