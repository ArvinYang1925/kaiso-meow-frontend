import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

export const Header = () => {
  return (
    <nav className="flex items-center justify-between px-6 py-2 shadow bg-white">
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
            <DropdownMenuItem>
              <Link to="/logout">登出</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
};
