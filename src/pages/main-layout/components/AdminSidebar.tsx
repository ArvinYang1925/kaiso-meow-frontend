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
  LucideIcon,
  EllipsisVertical,
} from "lucide-react";
import { cn } from "@/lib/utils";
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
import AvatarUser03 from "@/assets/homepage/avatar_user03.jpg";
import CatschooLogo from "@/assets/catschool_logo.jpg";

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
      <div className="p-4 border-b flex items-center gap-2">
        <img
          src={CatschooLogo}
          alt="Catschoo Logo"
          className="w-[42px] h-[32px] object-contain"
        />
        <span className="font-bold text-lg">程式喵學院</span>
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
            }}
            variant="ghost"
            className="w-full gap-2 bg-white hover:bg-slate-100 justify-start"
          >
            <span className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              課程管理
            </span>
            <ChevronDown
              className={cn(
                "h-4 w-4 transform transition-transform ml-auto",
                courseOpen && "rotate-180"
              )}
            />
          </Button>

          {courseOpen && (
            <div className="pl-4 mt-2 space-y-1 text-sm text-light-700 border-l-2 border-slate-200 ml-4">
              <SidebarSubItem
                label="課程列表"
                onClick={() => navigate(ADMIN_ROUTES.COURSELIST)}
              />
              {courseId && (
                <>
                  <SidebarSubItem
                    label="課程資訊"
                    onClick={() =>
                      handleCourseNavigation(ADMIN_ROUTES.COURSE_INFO)
                    }
                  />
                  <SidebarSubItem
                    label="章節管理"
                    onClick={() =>
                      handleCourseNavigation(ADMIN_ROUTES.SECTION_MANAGEMENT)
                    }
                  />
                  <SidebarSubItem
                    label="發佈/下架"
                    onClick={() =>
                      handleCourseNavigation(
                        ADMIN_ROUTES.COURSE_PUBLISHING_MANAGEMENT
                      )
                    }
                  />
                </>
              )}
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
      <div className="p-4 border-t flex items-center gap-3 bg-slate-50 hover:bg-slate-100">
        {/* Avatar */}
        <div className="shrink-0">
          <img
            src={AvatarUser03}
            alt="User Avatar"
            className="h-10 w-10 rounded-full object-cover"
          />
        </div>

        {/* Email & Role */}
        <div className="flex flex-col flex-1 min-w-0">
          <div className="text-sm font-medium truncate">
            {userInfo ? userInfo.email : ""}
          </div>
          <div className="text-xs text-gray-500 truncate">
            講師 / 學院擁有者
          </div>
        </div>

        {/* More Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 hover:bg-slate-200"
            >
              <EllipsisVertical className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuPortal>
            <DropdownMenuContent
              align="end"
              side="right"
              className="w-[268px] bg-white border border-gray-200 shadow-lg rounded-md p-1 z-50"
            >
              <DropdownMenuItem
                onClick={goToSettings}
                className="flex items-center gap-2 px-4 py-2.5 text-[14px] hover:bg-slate-50 cursor-pointer rounded-sm"
              >
                <UserCog className="h-4 w-4" />
                個人設定
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2.5 text-[14px] hover:bg-slate-50 cursor-pointer rounded-sm"
              >
                <LogOut className="h-4 w-4" />
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
      variant="ghost"
      className={cn(
        "w-full gap-2 bg-white hover:bg-slate-100 justify-start",
        isActive && "bg-slate-100"
      )}
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
      variant="ghost"
      className={cn(
        "w-full gap-2 bg-white hover:bg-slate-100 justify-start",
        isActive && "bg-slate-100"
      )}
      onClick={onClick}
    >
      {label}
    </Button>
  );
}
