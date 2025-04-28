
import { useState } from "react";
import { ChevronDown, LayoutDashboard, BookOpen, Users, ShoppingCart, Tag } from "lucide-react";
import { cn } from "@/lib/utils"; // shadcn 預設 lib，負責 class 合併
import { Button } from "@/components/ui/button";

export default function AdminSidebar() {
  const [courseOpen, setCourseOpen] = useState(false);

  return (
    <div className="h-screen w-64 bg-white border-r shadow-sm flex flex-col">
      {/* Logo */}
      <div className="p-6 font-bold text-xl border-b">
        程式喵學院
      </div>

      {/* Menu */}
      <nav className="flex-1 p-4 space-y-2">
        <SidebarItem icon={LayoutDashboard} label="數據儀表板" />

        {/* 課程管理 (可展開) */}
        <div>
          <button
            onClick={() => setCourseOpen(!courseOpen)}
            className="flex items-center justify-between w-full px-3 py-2 text-left text-sm font-medium hover:bg-gray-100 rounded-md transition"
          >
            <span className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              課程管理
            </span>
            <ChevronDown
              className={cn("h-4 w-4 transform transition-transform", courseOpen && "rotate-180")}
            />
          </button>

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
  return (
    <button className="block w-full text-left px-2 py-1 hover:text-black hover:font-semibold transition">
      {label}
    </button>
  );
}


// import {
//   Sidebar,
//   SidebarHeader,
//   SidebarMenu,
//   SidebarMenuItem,
//   SidebarTrigger,
//   SidebarContent,
//   SidebarProvider,
//   SidebarMenuSubButton,
//   SidebarMenuSub,
//   SidebarMenuSubItem,
// } from "@/components/ui/sidebar";
// import { useNavigate } from "react-router-dom";

// export function AdminSidebar() {
//   const navigate = useNavigate();

//   return (
//     <SidebarProvider>
//       <Sidebar className="border-r">
//         <SidebarHeader>
//           <h1 className="text-lg font-bold">程式喵學院</h1>
//         </SidebarHeader>

//         <SidebarContent>
//           <SidebarMenu>
//             <SidebarMenuItem onClick={() => navigate("/admin/admin-home")}>
//               數據儀表板
//             </SidebarMenuItem>
//             <SidebarMenuSub>
//               <SidebarMenuSubButton>課程管理</SidebarMenuSubButton>
//               <SidebarMenuSubItem onClick={() => navigate("/admin/courses/info")}>
//                 課程資訊
//               </SidebarMenuSubItem>
//               <SidebarMenuSubItem onClick={() => navigate("/admin/courses/chapters")}>
//                 章節管理
//               </SidebarMenuSubItem>
//               <SidebarMenuSubItem onClick={() => navigate("/admin/courses/archived")}>
//                 下架課程
//               </SidebarMenuSubItem>
//             </SidebarMenuSub>
//             <SidebarMenuItem onClick={() => navigate("/admin/student-list")}>
//               學生列表
//             </SidebarMenuItem>
//           </SidebarMenu>
//         </SidebarContent>

//         <SidebarTrigger />
//       </Sidebar>
//     </SidebarProvider>
//   );
// }
