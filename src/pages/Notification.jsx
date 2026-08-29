import React, { useState, useEffect } from "react";
import { FiCheckCircle, FiClock, FiAlertCircle, FiInfo } from "react-icons/fi";
import { api } from "../services/api";
import ConfirmModal from "../components/common/ConfirmModal";

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
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isClearModalOpen, setIsClearModalOpen] = useState(false);

  const fetchNotifications = async () => {
    try {
      const response = await api.get('/cutting/notifications/');
      setNotifications(response.data);
    } catch (error) {
      console.error("Failed to fetch notifications", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAllAsRead = async () => {
    try {
      await api.put('/cutting/notifications/mark-read/', {});
      fetchNotifications();
    } catch (error) {
      console.error("Failed to mark notifications as read", error);
    }
  };

  const handleClearAll = async () => {
    try {
      await api.delete("/cutting/notifications/clear/");
      fetchNotifications();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
        <div className="flex items-center gap-4">
          <button 
            onClick={handleMarkAllAsRead}
            className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
          >
            Mark all as read
          </button>
          <button 
            onClick={() => setIsClearModalOpen(true)}
            className="text-sm font-medium text-red-500 hover:text-red-600 transition-colors"
          >
            Clear All
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading notifications...</div>
        ) : notifications.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No notifications found.</div>
        ) : (
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
        )}
      </div>

      <ConfirmModal
        isOpen={isClearModalOpen}
        onClose={() => setIsClearModalOpen(false)}
        onConfirm={handleClearAll}
        title="Clear All Notifications"
        message="Are you sure you want to permanently delete all notifications? This action cannot be undone."
        confirmText="Clear All"
        isDanger={true}
      />
    </div>
  );
}
