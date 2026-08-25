import React from "react";
import { FiCheckCircle, FiClock, FiAlertCircle, FiInfo } from "react-icons/fi";

const notifications = [
  {
    id: 1,
    title: "New Order Received",
    message: "Order ORD-2026-0184 from Fresh Mart has been placed.",
    time: "5 minutes ago",
    type: "info",
    isRead: false,
  },
  {
    id: 2,
    title: "Order Ready",
    message: "Order ORD-2026-0183 is ready for dispatch.",
    time: "2 hours ago",
    type: "success",
    isRead: false,
  },
  {
    id: 3,
    title: "Order Delayed",
    message: "Order ORD-2026-0182 is running behind schedule.",
    time: "5 hours ago",
    type: "warning",
    isRead: true,
  },
  {
    id: 4,
    title: "System Maintenance",
    message: "Scheduled maintenance will occur tonight at 12:00 AM.",
    time: "1 day ago",
    type: "alert",
    isRead: true,
  }
];

const getIcon = (type) => {
  switch (type) {
    case 'success':
      return <div className="p-2 bg-green-100 text-green-600 rounded-full"><FiCheckCircle size={20} /></div>;
    case 'warning':
      return <div className="p-2 bg-orange-100 text-orange-500 rounded-full"><FiClock size={20} /></div>;
    case 'alert':
      return <div className="p-2 bg-red-100 text-red-500 rounded-full"><FiAlertCircle size={20} /></div>;
    case 'info':
    default:
      return <div className="p-2 bg-blue-100 text-blue-500 rounded-full"><FiInfo size={20} /></div>;
  }
};

export default function Notification() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
        <button className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors">
          Mark all as read
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="divide-y divide-gray-100">
          {notifications.map((notification) => (
            <div 
              key={notification.id} 
              className={`p-6 flex items-start gap-4 transition-colors hover:bg-gray-50/50 ${!notification.isRead ? 'bg-blue-50/20' : ''}`}
            >
              {getIcon(notification.type)}
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-4 mb-1">
                  <h3 className={`text-base font-semibold ${!notification.isRead ? 'text-gray-900' : 'text-gray-700'}`}>
                    {notification.title}
                  </h3>
                  <span className="text-sm text-gray-500 whitespace-nowrap">
                    {notification.time}
                  </span>
                </div>
                <p className="text-gray-600 text-sm">
                  {notification.message}
                </p>
              </div>
              
              {!notification.isRead && (
                <div className="w-2 h-2 mt-2 bg-blue-600 rounded-full flex-shrink-0" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
