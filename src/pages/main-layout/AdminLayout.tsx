import { ReactNode } from "react";
import { AdminSidebar } from "./components/AdminSidebar";

interface AdminLayoutProps {
  children: ReactNode; // children 是 React 的內建型別
}

export const AdminLayout = ({ children }: AdminLayoutProps) => {
  return (
    <>
      {/* 後台結構為水平排列 */}
      <div className="flex">
        <AdminSidebar />
        <main className="">{children}</main>
      </div>
    </>
  );
};
