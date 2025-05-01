import { Link, useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { CLIENT_ROUTES, PUBLIC_ROUTES } from "@/app/route-path";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/AuthStore";
import { useDialogStore } from "@/stores/CommonDialogStore";

export const Header = () => {
  const navigate = useNavigate(); // <-- 用來登出後跳轉

  const { isAuthenticated, token, userInfo, logout } = useAuthStore();
  const { showCommonDialog } = useDialogStore();

  const [userName, setUserName] = useState(userInfo?.name);

  // 登出功能
  const handleLogout = async () => {
    try {
      if (!token) {
        showCommonDialog({
          title: "身份驗證錯誤",
          description: "找不到 token",
        });
        return;
      }

      // 發送 logout 請求
      logout();

      // 導回登入頁面
      navigate(PUBLIC_ROUTES.LOGIN);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  useEffect(() => {
    if (userInfo) {
      setUserName(userInfo?.name.charAt(0));
    } else {
      setUserName("");
    }
  }, [userInfo]);

  return (
    <nav className="fixed top-0 left-0 w-full flex items-center justify-between px-6 py-2 shadow bg-white z-50">
      {/* 左logo：程式喵學院 */}
      <div className="text-xl font-bold text-orange-600">
        <Link to="/">程式喵學院</Link>
      </div>

      <div className="flex items-center">
        {/* 課程列表 */}
        <div className="space-x-6 me-4">
          <Link
            to="/client/courses"
            className="text-base text-gray-700 hover:text-orange-600"
          >
            課程列表
          </Link>
        </div>

        {/* Avatar + DropdownMenu */}
        {isAuthenticated == true ? (
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Avatar className="cursor-pointer">
                {/* <AvatarImage src="https://github.com/shadcn.png" /> */}
                <AvatarFallback>{userName}</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Link to={CLIENT_ROUTES.LEARNING}>我的學習</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link to={CLIENT_ROUTES.PROFILE}>個人資料</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link to={CLIENT_ROUTES.ORDER}>購買紀錄</Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout}>
                <Link to={PUBLIC_ROUTES.LOGOUT}>登出</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <>
            <Button
              className="me-2"
              onClick={() => navigate(PUBLIC_ROUTES.REGISTER)}
            >
              註冊
            </Button>
            <Button onClick={() => navigate(PUBLIC_ROUTES.LOGIN)}>登入</Button>
          </>
        )}
      </div>
    </nav>
  );
};
