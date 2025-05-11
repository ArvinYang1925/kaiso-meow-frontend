// import { ReactNode } from "react";
import { Outlet } from "react-router-dom";
import { Header } from "./components/Header";
import { Toaster } from "@/components/ui/toaster"; // shadcn 的 toast
import { CommonDialog } from "@/components/common/CommonDialog";
import ScrollToTop from "@/pages/main-layout/components/ScrollToTop";

export const StudentLayout = () => {
  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50">
        <Header />
      </header>
      {/* 給內容留出 Header 高度 pt-16 */}
      <main className="mt-32">
        <Outlet />
        <Toaster />
        <CommonDialog />
        <ScrollToTop />
      </main>
    </>
  );
};
