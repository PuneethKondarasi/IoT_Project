import { useState } from "react";

const Navbar = ({ onMenuButtonClick }) => {
  return (
    <header className="bg-gray-800 border-b border-gray-700 shadow-md">
      <div className="flex items-center justify-between px-4 py-3">
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
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          <h1 className="text-xl font-semibold text-emerald-400">Dashboard</h1>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
