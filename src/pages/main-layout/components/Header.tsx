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
import { useAuthStore } from "@/stores/authStore";
import { useDialogStore } from "@/stores/commonDialogStore";
import LOGO from "@/components/common/LOGO";

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
      navigate(PUBLIC_ROUTES.AUTH);
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
    <nav className="flex justify-content-center z-50">
      <div className="shadow w-full fixed top-0 left-0 py-4 bg-white">
        <div className="container flex items-center justify-between">
          <LOGO />

          <div className="flex items-center">
            {/* 課程列表 */}
            <div className="space-x-6 me-4">
              <Link
                to={CLIENT_ROUTES.COURSE_LIST}
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
                    <Link to={CLIENT_ROUTES.MY_LEARNING}>我的學習</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link to={CLIENT_ROUTES.PROFILE}>個人資料</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link to={CLIENT_ROUTES.ORDER_LIST}>購買紀錄</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>
                    登出
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button
                  className="me-2 bg-orange-600"
                  onClick={() => navigate(PUBLIC_ROUTES.AUTH)}
                >
                  登入 / 註冊
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
