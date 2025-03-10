"use client";
import { useState } from "react";
import { Toaster } from "react-hot-toast";
import Sidebar from "@/app/Components/Admin/Sidebar";

export default function AdminDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <div className="flex flex-col flex-grow">
        <header className="bg-white shadow-md p-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-green-700">Admin Dashboard</h1>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="text-green-700"
          >
            {isSidebarOpen ? "Close Sidebar" : "Open Sidebar"}
          </button>
        </header>
        <main className="flex-grow p-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Dashboard Content</h2>
            <p>Welcome to the admin dashboard. Here you can manage your application.</p>
          </div>
        </main>
      </div>
      <Toaster />
    </div>
  );
}