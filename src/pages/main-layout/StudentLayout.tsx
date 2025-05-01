// import { ReactNode } from "react";
import { Outlet } from "react-router-dom";
import { Header } from "./components/Header";
import { Toaster } from "@/components/ui/toaster"; // shadcn 的 toast
import { CommonDialog } from "@/components/common/Dialog";

export const StudentLayout = () => {
  return (
    <>
      <Header />
      {/* 給內容留出 Header 高度 pt-16 */}
      <main className="mt-32"> 
        <Outlet />
        <Toaster />
        <CommonDialog/>
      </main>
    </>
  );
};
