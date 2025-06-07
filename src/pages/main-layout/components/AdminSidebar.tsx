import { useState } from "react";
import { ADMIN_ROUTES, PUBLIC_ROUTES } from "@/app/route-path";
import {
  ChevronDown,
  Users,
  LogOut,
  UserCog,
  LucideIcon,
  EllipsisVertical,
  X,
  Settings,
} from "lucide-react";
import {
  LuChartLine,
  LuMonitor,
  LuShoppingCart,
  LuDollarSign,
} from "react-icons/lu";
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

interface AdminSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function AdminSidebar({
  isOpen = true,
  onClose,
}: AdminSidebarProps) {
  const [courseOpen, setCourseOpen] = useState(false);
  const { userInfo, logout } = useAuthStore();

  const navigate = useNavigate();
  const { courseId } = useParams();

  const handleLogout = () => {
    logout();
    navigate(PUBLIC_ROUTES.AUTH);
    onClose?.();
  };

  const goToSettings = () => {
    navigate(ADMIN_ROUTES.ME);
    onClose?.();
  };

  const handleCourseNavigation = (route: string) => {
    if (courseId) {
      navigate(route.replace(":courseId", courseId));
    } else {
      navigate(ADMIN_ROUTES.COURSES);
    }
    onClose?.();
  };

  const handleNavigation = (route: string) => {
    navigate(route);
    onClose?.();
  };

  return (
    <>
      {/* 手機版背景遮罩 */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "h-screen bg-white border-r shadow-sm fixed left-0 top-0 z-50",
          // 桌面版
          "md:w-80",
          // 手機版：根據 isOpen 狀態控制顯示/隱藏
          "w-[375px]",
          // 手機版滑動效果
          "transform transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        {/* Logo + 手機版關閉按鈕 */}
        <div className="p-4 border-b flex items-center justify-between">
          <div className="flex items-center gap-1">
            <img
              src={CatschooLogo}
              alt="Catschoo Logo"
              className="w-[42px] h-[32px] object-contain"
            />
            <span className="font-bold text-lg">程式喵學院</span>
          </div>

          {/* 手機版關閉按鈕 */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden h-8 w-8 hover:bg-slate-100 shrink-0"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* 手機版用戶資訊區域 */}
        <div className="md:hidden p-4 border-b flex items-center gap-3 bg-slate-50">
          <div className="shrink-0">
            <img
              src={AvatarUser03}
              alt="User Avatar"
              className="h-10 w-10 rounded-full object-cover"
            />
          </div>
          <div className="flex flex-col flex-1 min-w-0">
            <div className="text-sm font-medium truncate">
              {userInfo ? userInfo.email : ""}
            </div>
            <div className="text-xs text-gray-500 truncate">
              講師 / 學院擁有者
            </div>
          </div>
        </div>

        {/* Menu - 主要滾動區域，為底部留出空間 */}
        <div
          className="overflow-y-auto flex-1"
          style={{
            // 桌面版：減去頂部 Logo 區域和底部用戶資訊區域
            height: "calc(100vh - 160px)",
          }}
        >
          <nav className="p-4 space-y-2">
            <SidebarItem
              icon={LuChartLine}
              label="數據儀表板"
              onClick={() => handleNavigation(ADMIN_ROUTES.DASHBOARD)}
            />

            {/* 課程管理 (可展開) */}
            <div>
              <Button
                onClick={() => {
                  setCourseOpen(!courseOpen);
                }}
                variant="ghost"
                className="w-full gap-1 bg-white hover:bg-slate-100 justify-start"
              >
                <span className="flex items-center gap-1">
                  <LuMonitor className="h-4 w-4" />
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
                    onClick={() => handleNavigation(ADMIN_ROUTES.COURSELIST)}
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
                          handleCourseNavigation(
                            ADMIN_ROUTES.SECTION_MANAGEMENT
                          )
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
              onClick={() => handleNavigation(ADMIN_ROUTES.STUDENTS)}
            />
            <SidebarItem
              icon={LuShoppingCart}
              label="訂單管理"
              onClick={() => handleNavigation(ADMIN_ROUTES.INSTRUCTOR_ORDERS)}
            />
            <SidebarItem
              icon={LuDollarSign}
              label="折扣碼列表"
              onClick={() => handleNavigation(ADMIN_ROUTES.COUPONS)}
            />
          </nav>
        </div>

        {/* 手機版底部操作區域 - 絕對定位固定在底部 */}
        <div className="md:hidden absolute bottom-0 left-0 right-0 border-t bg-white">
          <div className="p-4 space-y-2">
            <SidebarItem
              icon={Settings}
              label="個人設定"
              onClick={goToSettings}
            />
            <SidebarItem icon={LogOut} label="登出" onClick={handleLogout} />
          </div>
        </div>

        {/* 桌面版 User Info + Dropdown - 絕對定位固定在底部 */}
        <div className="hidden md:flex absolute bottom-0 left-0 right-0 p-4 border-t items-center gap-3 bg-slate-50 hover:bg-slate-100">
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
    </>
  );
}

interface SidebarItemProps {
  icon: LucideIcon | React.ComponentType;
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
        "w-full gap-1 bg-white hover:bg-slate-100 justify-start",
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
        "w-full gap-1 bg-white hover:bg-slate-100 justify-start",
        isActive && "bg-slate-100"
      )}
      onClick={onClick}
    >
      {label}
    </Button>
  );
}
