import { MdMenu, MdNotificationsNone } from "react-icons/md";

import { FiSearch } from "react-icons/fi";

function Navbar({ setSidebarOpen }) {
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

        <div className="hidden md:flex items-center bg-[#F7F7F7] border border-[#00000026] rounded-xl px-4 py-2 w-72">
          <FiSearch className="text-gray-400" />

          <input type="text" placeholder="Search..." className="ml-2 w-full outline-none" />
        </div>

        {/* Notification */}

        <button className="relative">
          <MdNotificationsNone size={28} />

          <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
        </button>

        {/* Avatar */}

        <div className="w-12 h-12 rounded-full bg-indigo-700 text-white flex items-center justify-center font-semibold text-lg">
          A
        </div>
      </div>
    </header>
  );
}

export default Navbar;
