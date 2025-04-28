// import { ReactNode } from "react";
import { Outlet } from "react-router-dom";
import { Header } from "./components/Header";
import { Toaster } from "@/components/ui/toaster"; // shadcn 的 toast

export const ClientLayout = () => {
  return (
    <>
      <Header />
      {/* 給內容留出 Header 高度 pt-16 */}
      <main className=""> 
        <Outlet />
        <Toaster />
      </main>
    </>
  );
};
