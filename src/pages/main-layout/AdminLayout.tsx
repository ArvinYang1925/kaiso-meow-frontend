import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import AdminSidebar from "./components/AdminSidebar";
import { Breadcrumbs } from "./components/Breadcrumbs";
import CatschooLogo from "@/assets/catschool_logo.jpg";
import { CommonDialog } from "@/components/common/CommonDialog";

export function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="h-screen flex overflow-hidden bg-gray-100">
      {/* AdminSidebar */}
      <AdminSidebar isOpen={sidebarOpen} onClose={closeSidebar} />

      {/* 主要內容區域 */}
      <div className="flex-1 flex flex-col md:ml-80 ml-0">
        {/* 頂部導航欄 - 手機版漢堡選單 */}
        <header className="md:hidden bg-white border-b shadow-sm px-4 py-3 flex items-center justify-between relative z-30">
          {/* Logo */}
          <div className="flex items-center gap-1">
            <img
              src={CatschooLogo}
              alt="Catschoo Logo"
              className="w-[42px] h-[32px] object-contain"
            />
            <span className="font-bold text-lg">程式喵學院</span>
          </div>

          {/* 手機版漢堡選單按鈕 - 靠右側 */}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 hover:bg-gray-100 flex items-center justify-center"
            onClick={toggleSidebar}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </header>

        {/* 麵包屑導航 - 手機版和桌面版都顯示 */}
        <div className="p-4 border-b bg-white">
          <Breadcrumbs />
        </div>

        {/* 主要內容 */}
        <main className="flex-1 overflow-auto bg-gray-100">
          <Outlet />
          <CommonDialog />
        </main>
      </div>
    </div>
  );
}
