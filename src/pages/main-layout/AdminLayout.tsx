import { useState } from "react";
import AdminSidebar from "./components/AdminSidebar";
import { Outlet, useLocation } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { CommonDialog } from "@/components/common/CommonDialog";
import { Breadcrumbs } from "./components/Breadcrumbs";

export const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  // 檢查是否為 404 頁面
  const isNotFoundPage = location.pathname.includes("*");

  return (
    <div className="h-screen bg-gray-50 overflow-x-hidden flex flex-col">
      {/* 手機版 Header */}
      <div className="md:hidden flex items-center justify-between p-4 border-b bg-white">
        <div className="font-bold text-xl">程式喵學院</div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded shadow"
        >
          <div className="w-5 h-0.5 bg-black mb-1" />
          <div className="w-5 h-0.5 bg-black mb-1" />
          <div className="w-5 h-0.5 bg-black" />
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div
          className={`
            fixed top-16 md:top-0 left-0 h-[calc(100vh-64px)] md:h-screen w-64 bg-white border-r shadow-md
            transition-transform duration-300 z-50 overflow-y-auto md:overflow-y-hidden overflow-x-hidden
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
            md:translate-x-0 md:relative
          `}
        >
          <AdminSidebar />
        </div>

        {/* Main Content */}
        <main className="flex-1 overflow-auto overflow-x-hidden">
          {/* 麵包屑 */}
          {!isNotFoundPage && (
            <div className="p-4 border-b bg-white">
              <Breadcrumbs />
            </div>
          )}

          {/* 內容區域 */}
          <div className="p-4">
            <Outlet />
          </div>
        </main>
      </div>

      {/* 全局組件 */}
      <Toaster />
      <CommonDialog />
    </div>
  );
};
