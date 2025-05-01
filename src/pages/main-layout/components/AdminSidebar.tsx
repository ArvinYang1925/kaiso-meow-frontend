import { useState } from "react";
import { PUBLIC_ROUTES } from "@/app/route-path";
import {
  ChevronDown,
  LayoutDashboard,
  BookOpen,
  Users,
  ShoppingCart,
  Tag,
  LogOut,
  UserCog,
  EllipsisVertical,
} from "lucide-react";
import { cn } from "@/lib/utils"; // shadcn 預設 lib，負責 class 合併
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/AuthStore";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { useNavigate } from "react-router-dom";

export default function AdminSidebar() {
  const [courseOpen, setCourseOpen] = useState(false);
  const { userInfo, logout } = useAuthStore();

  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate(PUBLIC_ROUTES.LOGIN);
  };

  return (
    <div className="h-screen w-64 bg-white border-r shadow-sm flex flex-col">
      {/* Logo */}
      <div className="p-6 font-bold text-xl border-b">程式喵學院</div>

      {/* Menu */}
      <nav className="flex-1 p-4 space-y-2">
        <SidebarItem icon={LayoutDashboard} label="數據儀表板" />

        {/* 課程管理 (可展開) */}
        <div>
          {/*  <Button */}
          <Button
            onClick={() => setCourseOpen(!courseOpen)}
            className="w-full gap-2"
          >
            <span className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              課程管理
            </span>
            <ChevronDown
              className={cn(
                "h-4 w-4 transform transition-transform",
                courseOpen && "rotate-180"
              )}
            />
          </Button>

          {courseOpen && (
            <div className="pl-8 mt-2 space-y-1 text-sm text-light-700">
              <SidebarSubItem label="課程資訊" />
              <SidebarSubItem label="章節管理" />
              <SidebarSubItem label="下架課程" />
            </div>
          )}
        </div>

        <SidebarItem icon={Users} label="學生列表" />
        <SidebarItem icon={ShoppingCart} label="訂單管理" />
        <SidebarItem icon={Tag} label="折扣碼列表" />
      </nav>
      {/* User Info + Dropdown */}
      <div className="p-4 border-t flex items-center justify-between">
        {/* Avatar */}
        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-sm font-bold">
          {userInfo?.email?.charAt(0).toUpperCase()}
        </div>

        {/* Email & Role */}
        <div className="flex flex-col flex-1 mx-3 overflow-hidden">
          <div className="text-sm font-medium truncate">
            {userInfo ? userInfo.email : ""}
          </div>
          <div className="text-xs text-gray-500 truncate">
            {userInfo ? userInfo.role : ""}
          </div>
        </div>

        {/* More Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size="icon"
              className="h-8 w-8 text-orange hover:text-gray-700"
            >
              <EllipsisVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => alert("個人設定")}>
              <UserCog className="h-4 w-4 mr-2" />
              個人設定
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              登出
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

// 單一項目
function SidebarItem({ icon: Icon, label }: { icon: any; label: string }) {
  return (
    <Button className="w-full gap-2">
      <Icon className="h-4 w-4" />
      {label}
    </Button>
  );
}

// 子項目
function SidebarSubItem({ label }: { label: string }) {
  return <Button className="w-full gap-2">{label}</Button>;
}
