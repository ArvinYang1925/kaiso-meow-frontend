import { Link, useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { useEffect, useState } from "react";
import { Button } from "../../../components/ui/button";
import { logoutUser } from "../auth.service";
import { LoginResponseData } from "@/services/types";

export const Header = () => {
  const [isLogin, setIsLogin] = useState(false);
  const navigate = useNavigate(); // <-- 用來登出後跳轉
  // 從 localStorage 取出資料並解析
  const userInfoString = localStorage.getItem("userInfo");
  const userInfo: LoginResponseData = userInfoString
    ? JSON.parse(userInfoString)
    : null;

  // 登出功能
  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("No token found.");
        return;
      }

      // 發送 logout 請求
      const response = await logoutUser();
      console.log("logout response", response);

      alert(response.data.message);

      // 清除 localStorage
      localStorage.removeItem("token");
      localStorage.removeItem("userInfo");

      // 可以清空登入狀態（如果有管理 isLogin 之類）
      setIsLogin(false);

      // 導回登入頁面
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  useEffect(() => {
    if (userInfo) {
      setIsLogin(true);
    } else {
      setIsLogin(false);
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
            to="/courses"
            className="text-base text-gray-700 hover:text-orange-600"
          >
            課程列表
          </Link>
        </div>

        {/* Avatar + DropdownMenu */}
        {isLogin == true ? (
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Avatar className="cursor-pointer">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>喵</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Link to="/learning">我的學習</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link to="/profile">個人資料</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link to="/settings">購買紀錄</Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout}>
                <Link to="/logout">登出</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <>
            <Button className="me-2" onClick={() => navigate("/register")}>
              註冊
            </Button>
            <Button onClick={() => navigate("/login")}>登入</Button>
          </>
        )}
      </div>
    </nav>
  );
};
