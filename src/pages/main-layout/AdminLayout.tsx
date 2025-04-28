import { useState } from "react";
import AdminSidebar from "./components/AdminSidebar";
import { Outlet } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";

export const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      {/* 手機版：漢堡按鈕 */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="md:hidden fixed top-4 left-4 z-50 bg-white p-2 rounded shadow"
      >
        <div className="w-5 h-0.5 bg-black mb-1" />
        <div className="w-5 h-0.5 bg-black mb-1" />
        <div className="w-5 h-0.5 bg-black" />
      </button>

      {/* 結構 */}
      <div className="flex">
        {/* Sidebar 區塊 */}
        <div
          className={`
            fixed top-0 left-0 h-screen w-64 bg-white border-r shadow-md
            transition-transform duration-300
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
            md:translate-x-0
          `}
        >
          <AdminSidebar />
        </div>

        {/* Main 區塊 */}
        <main className="flex-1 ml-0 md:ml-64 p-4">
          <Outlet />
          <Toaster />
        </main>
      </div>
    </>
  );
};
