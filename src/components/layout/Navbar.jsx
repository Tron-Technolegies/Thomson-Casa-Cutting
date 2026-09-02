import React, { useState, useEffect } from "react";
import { MdMenu, MdNotificationsNone } from "react-icons/md";
import { FiSearch } from "react-icons/fi";
import { Link } from "react-router-dom";
import { api } from "../../services/api";

function Navbar({ setSidebarOpen }) {
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await api.get('/cutting/notifications/');
        if (response.data) {
          const unread = response.data.filter(n => !n.isRead).length;
          setUnreadCount(unread);
        }
      } catch (error) {
        console.error("Failed to fetch notifications for navbar", error);
      }
    };
    
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000); // refresh every minute
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-[#00000026] h-24 px-6 flex items-center justify-between">
      {/* Left */}

      <div className="flex items-center gap-4">
        <button className="lg:hidden" onClick={() => setSidebarOpen(true)}>
          <MdMenu size={28} />
        </button>

        <h1 className="text-2xl font-bold">Dashboard</h1>
      </div>

      {/* Right */}

      <div className="flex items-center gap-6">
        {/* Search */}

        {/* <div className="hidden md:flex items-center bg-[#F7F7F7] border border-[#00000026] rounded-xl px-4 py-2 w-72">
          <FiSearch className="text-gray-400" />

          <input type="text" placeholder="Search..." className="ml-2 w-full outline-none bg-transparent" />
        </div> */}

        {/* Notification */}

        <Link to="/notification" className="relative cursor-pointer hover:bg-gray-100 p-2 rounded-full transition">
          <MdNotificationsNone size={28} />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-2 h-4 w-4 rounded-full bg-red-500 border border-white text-[10px] font-bold text-white flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </Link>

        {/* Avatar */}

        <div className="w-12 h-12 rounded-full bg-indigo-700 text-white flex items-center justify-center font-semibold text-lg">
          A
        </div>
      </div>
    </header>
  );
}

export default Navbar;
