import { NavLink,useNavigate  } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

import { MdOutlineDashboard, MdClose,MdLogout } from "react-icons/md";

import { FiScissors, FiBell } from "react-icons/fi";

const menus = [
  {
    name: "Dashboard",
    icon: <MdOutlineDashboard size={22} />,
    path: "/",
  },

  {
    name: "Cutting Orders",
    icon: <FiScissors size={22} />,
    path: "/cutting-orders",
  },

  {
    name: "Notification",
    icon: <FiBell size={22} />,
    path: "/notification",
  },
];

function Sidebar({ sidebarOpen, setSidebarOpen }) {
      const { logout } = useAuth();
      const navigate = useNavigate();

      const handleLogout = () => {
        logout();
        setSidebarOpen(false);
        navigate("/login");
      };
  return (
    <>
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-white border-r border-[#00000026] transition-transform duration-300
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      >
        {/* Logo */}

        <div className="flex items-center justify-between px-6 h-24 border-b border-[#00000026]">
          <div>
            <h2 className="text-2xl font-bold text-[#465C8F]">Thomson Casa</h2>

            <p className="text-[#979797] text-sm">Supply ERP</p>
          </div>

          <button className="lg:hidden" onClick={() => setSidebarOpen(false)}>
            <MdClose size={28} />
          </button>
        </div>

        {/* Menu */}

        <nav className="mt-6 px-4 space-y-2">
          {menus.map((menu) => (
            <NavLink
              key={menu.path}
              to={menu.path}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-4 px-4 py-3 rounded-xl transition
                 ${
                   isActive
                     ? "bg-[#465C8F24] text-[#465C8F] font-semibold"
                     : "text-gray-600 hover:bg-gray-100"
                 }`
              }
            >
              {menu.icon}

              <span>{menu.name}</span>
            </NavLink>
          ))}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-100 transition"
          >
            <MdLogout size={22} />
            <span>Logout</span>
          </button>
        </nav>
      </aside>
    </>
  );
}


export default Sidebar;
