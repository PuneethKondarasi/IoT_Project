import { useState, useRef, useEffect } from "react";
import { BellIcon } from "@heroicons/react/24/outline";

const Navbar = ({ onMenuButtonClick, notifications }) => {
  const [isNotificationOpen, setNotificationOpen] = useState(false);
  const notificationRef = useRef(null);

  // Close notification dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setNotificationOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="bg-gray-800 border-b border-gray-700 shadow-md">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Logo and Menu Button */}
        <div className="flex items-center space-x-3">
          <button
            className="p-2 rounded-md text-gray-300 hover:text-white focus:outline-none lg:hidden"
            onClick={onMenuButtonClick}
            aria-label="Toggle Menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="text-xl font-semibold text-emerald-400">Dashboard</h1>
        </div>

        {/* Notification Bell */}
        <div className="relative" ref={notificationRef}>
          <button
            className="p-2 rounded-full text-gray-300 hover:text-white focus:outline-none"
            onClick={() => setNotificationOpen(!isNotificationOpen)}
            aria-label="Notifications"
          >
            <BellIcon className="w-6 h-6" />
            {notifications.length > 0 && (
              <span className="absolute top-0 right-0 inline-block w-2 h-2 bg-red-500 rounded-full" />
            )}
          </button>

          {isNotificationOpen && (
            <div className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto bg-white border border-gray-300 rounded-md shadow-lg z-10">
              <ul className="divide-y divide-gray-200">
                {notifications.length === 0 ? (
                  <li className="px-4 py-2 text-gray-500 text-sm">No alerts</li>
                ) : (
                  notifications.slice(0, 10).map((notif, index) => (
                    <li
                      key={index}
                      className="px-4 py-2 text-sm text-gray-800 hover:bg-gray-100 cursor-pointer"
                    >
                      <div>{notif.message}</div>
                      <div className="text-xs text-gray-500">{notif.time}</div>
                    </li>
                  ))
                )}
              </ul>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
