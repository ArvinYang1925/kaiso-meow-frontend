import { useState } from "react";
import { ADMIN_ROUTES, PUBLIC_ROUTES } from "@/app/route-path";
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
  LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils"; // shadcn 預設 lib，負責 class 合併
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/authStore";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuPortal,
} from "@radix-ui/react-dropdown-menu";
import { useNavigate, useParams } from "react-router-dom";

export default function AdminSidebar() {
  const [courseOpen, setCourseOpen] = useState(false);
  const { userInfo, logout } = useAuthStore();

  const navigate = useNavigate();
  const { courseId } = useParams();

  const handleLogout = () => {
    logout();
    navigate(PUBLIC_ROUTES.AUTH);
  };

  const goToSettings = () => {
    navigate(ADMIN_ROUTES.ME);
  };

  const handleCourseNavigation = (route: string) => {
    if (courseId) {
      navigate(route.replace(":courseId", courseId));
    } else {
      navigate(ADMIN_ROUTES.COURSES);
    }
  };

  return (
    <div className="h-screen w-64 bg-white border-r shadow-sm flex flex-col fixed left-0 top-0 z-50 overflow-y-auto md:overflow-y-hidden overflow-x-hidden">
      {/* Logo */}
      <div className="p-6 font-bold text-xl border-b hidden md:block">
        程式喵學院
      </div>

      {/* Menu */}
      <nav className="flex-1 p-4 space-y-2">
        <SidebarItem
          icon={LayoutDashboard}
          label="數據儀表板"
          onClick={() => navigate(ADMIN_ROUTES.DASHBOARD)}
        />

        {/* 課程管理 (可展開) */}
        <div>
          {/*  <Button */}
          <Button
            onClick={() => {
              setCourseOpen(!courseOpen);
              navigate(ADMIN_ROUTES.COURSES);
            }}
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
              <SidebarSubItem
                label="課程資訊"
                onClick={() => handleCourseNavigation(ADMIN_ROUTES.COURSE_INFO)}
              />
              <SidebarSubItem
                label="章節管理"
                onClick={() =>
                  handleCourseNavigation(ADMIN_ROUTES.CHAPTER_MANAGEMENT)
                }
              />
              <SidebarSubItem
                label="下架課程"
                onClick={() =>
                  handleCourseNavigation(ADMIN_ROUTES.DEACTIVATE_COURSE)
                }
              />
            </div>
          )}
        </div>

        <SidebarItem
          icon={Users}
          label="學生列表"
          onClick={() => navigate(ADMIN_ROUTES.STUDENTS)}
        />
        <SidebarItem
          icon={ShoppingCart}
          label="訂單管理"
          onClick={() => navigate(ADMIN_ROUTES.INSTRUCTOR_ORDERS)}
        />
        <SidebarItem
          icon={Tag}
          label="折扣碼列表"
          onClick={() => navigate(ADMIN_ROUTES.COUPONS)}
        />
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
              variant="ghost"
              className="h-8 w-8 bg-white hover:bg-gray-100"
            >
              <EllipsisVertical className="h-8 w-8 text-gray-600" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuPortal>
            <DropdownMenuContent
              align="end"
              side="right"
              alignOffset={-20}
              sideOffset={24}
              avoidCollisions={false}
              className="flex flex-col bg-black text-white border-black -translate-y-full p-0 z-50"
            >
              <DropdownMenuItem
                onClick={goToSettings}
                className="flex flex-row items-center text-white hover:bg-gray-800 focus:bg-gray-800 px-4 pt-4 pb-2"
              >
                <UserCog className="h-4 w-4 mr-2 text-white" />
                個人設定
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleLogout}
                className="flex flex-row items-center text-white hover:bg-gray-800 focus:bg-gray-800 px-4 pt-2 pb-4"
              >
                <LogOut className="h-4 w-4 mr-2 text-white" />
                登出
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenuPortal>
        </DropdownMenu>
      </div>
    </div>
  );
}

interface SidebarItemProps {
  icon: LucideIcon;
  label: string;
  isActive?: boolean;
  onClick?: () => void;
  children?: React.ReactNode;
}

function SidebarItem({
  icon: Icon,
  label,
  isActive = false,
  onClick,
  children,
}: SidebarItemProps) {
  return (
    <Button
      className={cn("w-full gap-2", isActive && "bg-gray-200")}
      onClick={onClick}
    >
      <Icon className="h-4 w-4" />
      {label}
      {children}
    </Button>
  );
}

interface SidebarSubItemProps {
  label: string;
  isActive?: boolean;
  onClick?: () => void;
}

function SidebarSubItem({
  label,
  isActive = false,
  onClick,
}: SidebarSubItemProps) {
  return (
    <Button
      className={cn("w-full gap-2", isActive && "bg-gray-200")}
      onClick={onClick}
    >
      {label}
    </Button>
  );
}
