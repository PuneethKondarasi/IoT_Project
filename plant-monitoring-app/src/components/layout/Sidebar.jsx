import { Link, useLocation } from "react-router-dom";
import { HomeIcon, Cog6ToothIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useEffect } from "react";

const Sidebar = ({ open, setOpen }) => {
  const location = useLocation();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (open && !event.target.closest(".sidebar-container")) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open, setOpen]);

  const navigation = [
    { name: "Dashboard", href: "/", icon: HomeIcon },
    { name: "Control Center", href: "/settings", icon: Cog6ToothIcon },
  ];

  return (
    <>
      {open && <div className="fixed inset-0 z-40 bg-gray-900 bg-opacity-75 lg:hidden" />}

      <div
        className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-gray-800 border-r border-gray-700
          transform transition-transform duration-300 ease-in-out sidebar-container
          ${open ? "translate-x-0" : "-translate-x-full"} 
          lg:translate-x-0 lg:static lg:w-20 xl:w-64
        `}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-700">
          <span className="text-xl font-semibold text-white xl:block hidden">PlantSense</span>
          <button
            className="p-1 rounded-md text-gray-400 hover:text-white focus:outline-none lg:hidden"
            onClick={() => setOpen(false)}
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        <nav className="flex flex-col h-full py-4">
          <ul className="flex-1 px-2 space-y-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className={`flex items-center px-2 py-3 rounded-md group ${
                      isActive ? "bg-gray-700 text-emerald-400" : "text-gray-300 hover:text-white hover:bg-gray-700"
                    }`}
                  >
                    <item.icon className="w-6 h-6 mr-3 flex-shrink-0" />
                    <span className="xl:block hidden">{item.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
