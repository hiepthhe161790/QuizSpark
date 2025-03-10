"use client";
import { useState } from "react";
import { FiUsers, FiSettings, FiActivity, FiMenu, FiX } from "react-icons/fi";
import { MdDashboard } from "react-icons/md";
import Link from "next/link";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="flex">
      {/* Sidebar */}
      <div
        className={`${
          isOpen ? "w-64" : "w-16"
        } bg-gray-800 h-screen p-5 transition-all duration-300`}
      >
        {/* Toggle Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-white text-2xl mb-5"
        >
          {isOpen ? <FiX /> : <FiMenu />}
        </button>

        {/* Menu Items */}
        <nav className="space-y-4">
          <Link
            href="/admin/dashboard"
            className="flex items-center space-x-3 text-white hover:bg-gray-700 p-3 rounded-md transition"
          >
            <MdDashboard className="text-2xl" />
            {isOpen && <span>Dashboard</span>}
          </Link>

          <Link
            href="/admin/users"
            className="flex items-center space-x-3 text-white hover:bg-gray-700 p-3 rounded-md transition"
          >
            <FiUsers className="text-2xl" />
            {isOpen && <span>Users</span>}
          </Link>

          <Link
            href="/"
            className="flex items-center space-x-3 text-white hover:bg-gray-700 p-3 rounded-md transition"
          >
            <FiActivity className="text-2xl" />
            {isOpen && <span>Quizzes</span>}
          </Link>

          <Link
            href="/admin/settings"
            className="flex items-center space-x-3 text-white hover:bg-gray-700 p-3 rounded-md transition"
          >
            <FiSettings className="text-2xl" />
            {isOpen && <span>Settings</span>}
          </Link>
        </nav>
      </div>
    </div>
  );
}
