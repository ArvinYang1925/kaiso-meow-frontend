import { Link, useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { CLIENT_ROUTES, PUBLIC_ROUTES, ADMIN_ROUTES } from "@/app/route-path";
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
import { Role } from "@/lib/enum";
import {
  LuBookOpen,
  LuUser,
  LuPanelTop,
  LuLogOut,
  LuMenu,
  LuX,
} from "react-icons/lu";

export const Header = () => {
  const navigate = useNavigate();
  const { isAuthenticated, token, userInfo, logout } = useAuthStore();
  const { showCommonDialog } = useDialogStore();
  const [userName, setUserName] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  // 防止頁面捲軸 - 當選單開啟時
  useEffect(() => {
    if (isMobileMenuOpen || isUserMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    // 清理函數
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen, isUserMenuOpen]);

  // 登出功能
  const handleLogout = () => {
    if (!token) {
      showCommonDialog({
        title: "身份驗證錯誤",
        description: "找不到 token",
      });
      return;
    }
    logout();
    navigate(PUBLIC_ROUTES.AUTH);
    setIsMobileMenuOpen(false);
  };

  // 定義選單項目
  const studentMenuItems = [
    { path: CLIENT_ROUTES.MY_LEARNING, name: "我的學習", icon: LuBookOpen },
    { path: CLIENT_ROUTES.PROFILE, name: "個人資料", icon: LuUser },
    { path: CLIENT_ROUTES.ORDER_LIST, name: "購買紀錄", icon: LuPanelTop },
  ];

  const instructorMenuItems = [
    { path: ADMIN_ROUTES.HOME, name: "返回後台", icon: LuUser },
  ];

  // 根據身份獲取對應選單項目
  const getMenuItems = () => {
    return userInfo?.role === Role.INSTRUCTOR
      ? instructorMenuItems
      : studentMenuItems;
  };

  useEffect(() => {
    setUserName(userInfo?.name?.charAt(0) || "");
  }, [userInfo]);

  // 手機版課程列表選單
  const MobileCourseMenu = () => (
    <div
      className={`fixed inset-0 bg-white z-[9999] overflow-hidden ${
        isMobileMenuOpen ? "block" : "hidden"
      }`}
    >
      <div className="flex justify-between items-center p-4 border-b h-16 overflow-hidden">
        <div className="flex items-center min-w-0 flex-1">
          <LOGO className="w-[120px]" />
        </div>
        <button
          onClick={() => setIsMobileMenuOpen(false)}
          className="p-2 flex-shrink-0 ml-2"
        >
          <LuX className="w-6 h-6" />
        </button>
      </div>

      <div className="flex flex-col h-[calc(100vh-4rem)] overflow-hidden">
        <div className="flex-1 p-4 overflow-hidden">
          <Link
            to={CLIENT_ROUTES.COURSE_LIST}
            className="flex items-center px-4 py-4 cursor-pointer hover:bg-gray-100 rounded-lg"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            課程列表
          </Link>
        </div>

        {/* 未登入時顯示登入按鈕 */}
        {!isAuthenticated && (
          <div className="p-4 border-t flex-shrink-0">
            <Button
              className="w-full bg-orange-600 hover:bg-orange-500 h-12"
              onClick={() => {
                navigate(PUBLIC_ROUTES.AUTH);
                setIsMobileMenuOpen(false);
              }}
            >
              登入 / 註冊
            </Button>
          </div>
        )}
      </div>
    </div>
  );

  // 手機版用戶選單
  const MobileUserMenu = () => (
    <div
      className={`fixed inset-0 bg-white z-[9999] overflow-hidden ${
        isUserMenuOpen ? "block" : "hidden"
      }`}
    >
      <div className="flex justify-between items-center p-4 border-b h-16 overflow-hidden">
        <div className="flex items-center min-w-0 flex-1">
          <LOGO className="w-[120px]" />
        </div>
        <button
          onClick={() => setIsUserMenuOpen(false)}
          className="p-2 flex-shrink-0 ml-2"
        >
          <LuX className="w-6 h-6" />
        </button>
      </div>

      {isAuthenticated ? (
        <div className="flex flex-col h-[calc(100vh-4rem)] overflow-hidden">
          {/* 用戶資訊 */}
          <div className="p-4 border-b flex-shrink-0">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12 flex-shrink-0">
                <AvatarFallback>{userName}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col min-w-0 flex-1">
                <span className="font-medium truncate">{userInfo?.name}</span>
                <span className="text-sm text-gray-500 truncate">
                  {userInfo?.email}
                </span>
              </div>
            </div>
          </div>

          {/* 主要選單項目 + 登出按鈕 */}
          <div className="flex-1 overflow-hidden">
            {getMenuItems().map((item) => {
              const IconComponent = item.icon;
              return (
                <div
                  key={item.path}
                  onClick={() => {
                    navigate(item.path);
                    setIsUserMenuOpen(false);
                  }}
                  className="flex items-center px-4 py-4 cursor-pointer hover:bg-gray-100"
                >
                  <IconComponent className="w-5 h-5 flex-shrink-0" />
                  <span className="ml-3 flex-1 truncate">{item.name}</span>
                  <span className="text-gray-400 flex-shrink-0">›</span>
                </div>
              );
            })}

            <div
              onClick={handleLogout}
              className="flex items-center px-4 py-4 cursor-pointer hover:bg-gray-100 border-t"
            >
              <LuLogOut className="w-5 h-5 flex-shrink-0" />
              <span className="ml-3">登出</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col h-[calc(100vh-4rem)] overflow-hidden">
          <div className="flex-1"></div>
          <div className="p-4 flex-shrink-0">
            <Button
              className="w-full bg-orange-600 hover:bg-orange-500 h-12"
              onClick={() => {
                navigate(PUBLIC_ROUTES.AUTH);
                setIsUserMenuOpen(false);
              }}
            >
              登入 / 註冊
            </Button>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <nav className="w-full z-50 overflow-x-hidden">
      <div className="shadow w-full fixed top-0 left-0 px-4 py-2 md:px-6 md:py-4 bg-white overflow-hidden">
        <div className="w-full px-2 md:px-4 flex items-center justify-between overflow-hidden max-w-full">
          {/* Logo 區域 */}
          <div className="flex items-center flex-shrink-0 min-w-0">
            <LOGO className="w-[120px] md:w-[154px] mr-2 md:mr-4 max-w-full" />
          </div>

          <div className="flex items-center min-w-0 flex-shrink-0">
            {/* 課程列表 - 桌機版顯示 */}
            <div className="hidden md:block me-2 lg:me-4">
              <Link
                to={CLIENT_ROUTES.COURSE_LIST}
                className="text-sm md:text-base text-gray-700 hover:text-orange-600 whitespace-nowrap"
              >
                課程列表
              </Link>
            </div>

            {/* Avatar + DropdownMenu - 桌機版 */}
            {isAuthenticated ? (
              <>
                <div className="hidden md:block">
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <Avatar className="cursor-pointer">
                        <AvatarFallback>{userName}</AvatarFallback>
                      </Avatar>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="w-[240px] md:w-[268px] p-2"
                    >
                      {/* 用戶資訊區塊 */}
                      <div className="px-2 py-3 border-b">
                        <div className="flex items-center gap-3">
                          <Avatar className="flex-shrink-0">
                            <AvatarFallback>{userName}</AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col min-w-0 flex-1">
                            <span className="font-medium truncate">
                              {userInfo?.name}
                            </span>
                            <span className="text-sm text-gray-500 truncate">
                              {userInfo?.email}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* 主要選單項目 */}
                      <div className="py-2">
                        {getMenuItems().map((item) => {
                          const IconComponent = item.icon;
                          return (
                            <DropdownMenuItem
                              key={item.path}
                              onClick={() => navigate(item.path)}
                              className="px-2 py-2.5 cursor-pointer hover:bg-gray-100 focus:bg-gray-100 rounded-lg"
                            >
                              <div className="flex items-center min-w-0 w-full">
                                <IconComponent className="w-4 h-4 flex-shrink-0" />
                                <span className="ml-2 truncate">
                                  {item.name}
                                </span>
                              </div>
                            </DropdownMenuItem>
                          );
                        })}
                      </div>

                      {/* 登出按鈕 */}
                      <div className="py-2 border-t">
                        <DropdownMenuItem
                          onClick={handleLogout}
                          className="px-2 py-2.5 cursor-pointer hover:bg-gray-100 focus:bg-gray-100 rounded-lg"
                        >
                          <div className="flex items-center">
                            <LuLogOut className="w-4 h-4 flex-shrink-0" />
                            <span className="ml-2">登出</span>
                          </div>
                        </DropdownMenuItem>
                      </div>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                {/* 手機版選單按鈕 */}
                <div className="md:hidden flex items-center flex-shrink-0">
                  {/* 漢堡選單按鈕 */}
                  <button
                    className="p-2"
                    onClick={() => setIsMobileMenuOpen(true)}
                  >
                    <LuMenu className="w-6 h-6" />
                  </button>
                  {/* 用戶頭像按鈕 */}
                  <Avatar
                    className="cursor-pointer ml-2"
                    onClick={() => setIsUserMenuOpen(true)}
                  >
                    <AvatarFallback>{userName}</AvatarFallback>
                  </Avatar>
                </div>
              </>
            ) : (
              <>
                <div className="hidden md:block">
                  <Button
                    className="bg-orange-600 hover:bg-orange-500 whitespace-nowrap text-sm px-3 py-2"
                    onClick={() => navigate(PUBLIC_ROUTES.AUTH)}
                  >
                    登入 / 註冊
                  </Button>
                </div>
                {/* 手機版漢堡選單 */}
                <button
                  className="md:hidden p-2 flex-shrink-0"
                  onClick={() => setIsMobileMenuOpen(true)}
                >
                  <LuMenu className="w-6 h-6" />
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* 手機版選單 */}
      <MobileCourseMenu />
      <MobileUserMenu />
    </nav>
  );
};

// import { Link, useNavigate } from "react-router-dom";
// import { Avatar, AvatarFallback } from "@/components/ui/avatar";
// import { CLIENT_ROUTES, PUBLIC_ROUTES, ADMIN_ROUTES } from "@/app/route-path";
// import {
//   DropdownMenu,
//   DropdownMenuTrigger,
//   DropdownMenuContent,
//   DropdownMenuItem,
// } from "@/components/ui/dropdown-menu";
// import { useEffect, useState } from "react";
// import { Button } from "@/components/ui/button";
// import { useAuthStore } from "@/stores/authStore";
// import { useDialogStore } from "@/stores/commonDialogStore";
// import LOGO from "@/components/common/LOGO";
// import { Role } from "@/lib/enum";
// import {
//   LuBookOpen,
//   LuUser,
//   LuPanelTop,
//   LuLogOut,
//   LuMenu,
//   LuX,
// } from "react-icons/lu";

// export const Header = () => {
//   const navigate = useNavigate();
//   const { isAuthenticated, token, userInfo, logout } = useAuthStore();
//   const { showCommonDialog } = useDialogStore();
//   const [userName, setUserName] = useState("");
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
//   const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

//   // 防止頁面捲軸 - 當選單開啟時
//   useEffect(() => {
//     if (isMobileMenuOpen || isUserMenuOpen) {
//       document.body.style.overflow = "hidden";
//     } else {
//       document.body.style.overflow = "unset";
//     }

//     // 清理函數
//     return () => {
//       document.body.style.overflow = "unset";
//     };
//   }, [isMobileMenuOpen, isUserMenuOpen]);

//   // 登出功能
//   const handleLogout = () => {
//     if (!token) {
//       showCommonDialog({
//         title: "身份驗證錯誤",
//         description: "找不到 token",
//       });
//       return;
//     }
//     logout();
//     navigate(PUBLIC_ROUTES.AUTH);
//     setIsMobileMenuOpen(false);
//   };

//   // 定義選單項目
//   const studentMenuItems = [
//     { path: CLIENT_ROUTES.MY_LEARNING, name: "我的學習", icon: LuBookOpen },
//     { path: CLIENT_ROUTES.PROFILE, name: "個人資料", icon: LuUser },
//     { path: CLIENT_ROUTES.ORDER_LIST, name: "購買紀錄", icon: LuPanelTop },
//   ];

//   const instructorMenuItems = [
//     { path: ADMIN_ROUTES.HOME, name: "返回後台", icon: LuUser },
//   ];

//   // 根據身份獲取對應選單項目
//   const getMenuItems = () => {
//     return userInfo?.role === Role.INSTRUCTOR
//       ? instructorMenuItems
//       : studentMenuItems;
//   };

//   useEffect(() => {
//     setUserName(userInfo?.name?.charAt(0) || "");
//   }, [userInfo]);

//   // 手機版課程列表選單
//   const MobileCourseMenu = () => (
//     <div
//       className={`fixed inset-0 bg-white z-[9999] overflow-hidden ${
//         isMobileMenuOpen ? "block" : "hidden"
//       }`}
//     >
//       <div className="flex justify-between items-center p-4 border-b h-16 overflow-hidden">
//         <div className="flex items-center min-w-0 flex-1">
//           <LOGO className="w-[120px]" />
//         </div>
//         <button
//           onClick={() => setIsMobileMenuOpen(false)}
//           className="p-2 flex-shrink-0 ml-2"
//         >
//           <LuX className="w-6 h-6" />
//         </button>
//       </div>

//       <div className="flex flex-col h-[calc(100vh-4rem)] overflow-hidden">
//         <div className="flex-1 p-4 overflow-hidden">
//           <Link
//             to={CLIENT_ROUTES.COURSE_LIST}
//             className="flex items-center px-4 py-4 cursor-pointer hover:bg-gray-100 rounded-lg"
//             onClick={() => setIsMobileMenuOpen(false)}
//           >
//             課程列表
//           </Link>
//         </div>

//         {/* 未登入時顯示登入按鈕 */}
//         {!isAuthenticated && (
//           <div className="p-4 border-t flex-shrink-0">
//             <Button
//               className="w-full bg-orange-600 h-12"
//               onClick={() => {
//                 navigate(PUBLIC_ROUTES.AUTH);
//                 setIsMobileMenuOpen(false);
//               }}
//             >
//               登入 / 註冊
//             </Button>
//           </div>
//         )}
//       </div>
//     </div>
//   );

//   // 手機版用戶選單
//   const MobileUserMenu = () => (
//     <div
//       className={`fixed inset-0 bg-white z-[9999] overflow-hidden ${
//         isUserMenuOpen ? "block" : "hidden"
//       }`}
//     >
//       <div className="flex justify-between items-center p-4 border-b h-16 overflow-hidden">
//         <div className="flex items-center min-w-0 flex-1">
//           <LOGO className="w-[120px]" />
//         </div>
//         <button
//           onClick={() => setIsUserMenuOpen(false)}
//           className="p-2 flex-shrink-0 ml-2"
//         >
//           <LuX className="w-6 h-6" />
//         </button>
//       </div>

//       {isAuthenticated ? (
//         <div className="flex flex-col h-[calc(100vh-4rem)] overflow-hidden">
//           {/* 用戶資訊 */}
//           <div className="p-4 border-b flex-shrink-0">
//             <div className="flex items-center gap-3">
//               <Avatar className="h-12 w-12 flex-shrink-0">
//                 <AvatarFallback>{userName}</AvatarFallback>
//               </Avatar>
//               <div className="flex flex-col min-w-0 flex-1">
//                 <span className="font-medium truncate">{userInfo?.name}</span>
//                 <span className="text-sm text-gray-500 truncate">
//                   {userInfo?.email}
//                 </span>
//               </div>
//             </div>
//           </div>

//           {/* 主要選單項目 */}
//           <div className="flex-1 overflow-hidden">
//             {getMenuItems().map((item) => {
//               const IconComponent = item.icon;
//               return (
//                 <div
//                   key={item.path}
//                   onClick={() => {
//                     navigate(item.path);
//                     setIsUserMenuOpen(false);
//                   }}
//                   className="flex items-center px-4 py-4 cursor-pointer hover:bg-gray-100"
//                 >
//                   <IconComponent className="w-5 h-5 flex-shrink-0" />
//                   <span className="ml-3 flex-1 truncate">{item.name}</span>
//                   <span className="text-gray-400 flex-shrink-0">›</span>
//                 </div>
//               );
//             })}
//           </div>

//           {/* 登出按鈕 */}
//           <div className="p-4 border-t flex-shrink-0">
//             <div
//               onClick={handleLogout}
//               className="flex items-center px-4 py-4 cursor-pointer hover:bg-gray-100 rounded-lg"
//             >
//               <LuLogOut className="w-5 h-5 flex-shrink-0" />
//               <span className="ml-3">登出</span>
//             </div>
//           </div>
//         </div>
//       ) : (
//         <div className="flex flex-col h-[calc(100vh-4rem)] overflow-hidden">
//           <div className="flex-1"></div>
//           <div className="p-4 flex-shrink-0">
//             <Button
//               className="w-full bg-orange-600 h-12"
//               onClick={() => {
//                 navigate(PUBLIC_ROUTES.AUTH);
//                 setIsUserMenuOpen(false);
//               }}
//             >
//               登入 / 註冊
//             </Button>
//           </div>
//         </div>
//       )}
//     </div>
//   );

//   return (
//     <nav className="w-full z-50 overflow-x-hidden">
//       <div className="shadow w-full fixed top-0 left-0 px-4 py-2 md:px-6 md:py-4 bg-white overflow-hidden">
//         <div className="w-full px-2 md:px-4 flex items-center justify-between overflow-hidden max-w-full">
//           {/* Logo 區域 */}
//           <div className="flex items-center flex-shrink-0 min-w-0">
//             <LOGO className="w-[120px] md:w-[154px] mr-2 md:mr-4 max-w-full" />
//           </div>

//           <div className="flex items-center min-w-0 flex-shrink-0">
//             {/* 課程列表 - 桌機版顯示 */}
//             <div className="hidden md:block me-2 lg:me-4">
//               <Link
//                 to={CLIENT_ROUTES.COURSE_LIST}
//                 className="text-sm md:text-base text-gray-700 hover:text-orange-600 whitespace-nowrap"
//               >
//                 課程列表
//               </Link>
//             </div>

//             {/* Avatar + DropdownMenu - 桌機版 */}
//             {isAuthenticated ? (
//               <>
//                 <div className="hidden md:block">
//                   <DropdownMenu>
//                     <DropdownMenuTrigger>
//                       <Avatar className="cursor-pointer">
//                         <AvatarFallback>{userName}</AvatarFallback>
//                       </Avatar>
//                     </DropdownMenuTrigger>
//                     <DropdownMenuContent
//                       align="end"
//                       className="w-[240px] md:w-[268px] p-2"
//                     >
//                       {/* 用戶資訊區塊 */}
//                       <div className="px-2 py-3 border-b">
//                         <div className="flex items-center gap-3">
//                           <Avatar className="flex-shrink-0">
//                             <AvatarFallback>{userName}</AvatarFallback>
//                           </Avatar>
//                           <div className="flex flex-col min-w-0 flex-1">
//                             <span className="font-medium truncate">
//                               {userInfo?.name}
//                             </span>
//                             <span className="text-sm text-gray-500 truncate">
//                               {userInfo?.email}
//                             </span>
//                           </div>
//                         </div>
//                       </div>

//                       {/* 主要選單項目 */}
//                       <div className="py-2">
//                         {getMenuItems().map((item) => {
//                           const IconComponent = item.icon;
//                           return (
//                             <DropdownMenuItem
//                               key={item.path}
//                               onClick={() => navigate(item.path)}
//                               className="px-2 py-2.5 cursor-pointer hover:bg-gray-100 focus:bg-gray-100 rounded-lg"
//                             >
//                               <div className="flex items-center min-w-0 w-full">
//                                 <IconComponent className="w-4 h-4 flex-shrink-0" />
//                                 <span className="ml-2 truncate">
//                                   {item.name}
//                                 </span>
//                               </div>
//                             </DropdownMenuItem>
//                           );
//                         })}
//                       </div>

//                       {/* 登出按鈕 */}
//                       <div className="py-2 border-t">
//                         <DropdownMenuItem
//                           onClick={handleLogout}
//                           className="px-2 py-2.5 cursor-pointer hover:bg-gray-100 focus:bg-gray-100 rounded-lg"
//                         >
//                           <div className="flex items-center">
//                             <LuLogOut className="w-4 h-4 flex-shrink-0" />
//                             <span className="ml-2">登出</span>
//                           </div>
//                         </DropdownMenuItem>
//                       </div>
//                     </DropdownMenuContent>
//                   </DropdownMenu>
//                 </div>
//                 {/* 手機版選單按鈕 */}
//                 <div className="md:hidden flex items-center flex-shrink-0">
//                   {/* 漢堡選單按鈕 */}
//                   <button
//                     className="p-2"
//                     onClick={() => setIsMobileMenuOpen(true)}
//                   >
//                     <LuMenu className="w-6 h-6" />
//                   </button>
//                   {/* 用戶頭像按鈕 */}
//                   <Avatar
//                     className="cursor-pointer ml-2"
//                     onClick={() => setIsUserMenuOpen(true)}
//                   >
//                     <AvatarFallback>{userName}</AvatarFallback>
//                   </Avatar>
//                 </div>
//               </>
//             ) : (
//               <>
//                 <div className="hidden md:block">
//                   <Button
//                     className="bg-orange-600 whitespace-nowrap text-sm px-3 py-2"
//                     onClick={() => navigate(PUBLIC_ROUTES.AUTH)}
//                   >
//                     登入 / 註冊
//                   </Button>
//                 </div>
//                 {/* 手機版漢堡選單 */}
//                 <button
//                   className="md:hidden p-2 flex-shrink-0"
//                   onClick={() => setIsMobileMenuOpen(true)}
//                 >
//                   <LuMenu className="w-6 h-6" />
//                 </button>
//               </>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* 手機版選單 */}
//       <MobileCourseMenu />
//       <MobileUserMenu />
//     </nav>
//   );
// };
