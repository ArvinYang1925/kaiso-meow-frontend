// import { ReactNode } from "react";
import { Outlet } from "react-router-dom";
import { Header } from "./components/Header";
import { Toaster } from "@/components/ui/toaster"; // shadcn 的 toast
import { CommonDialog } from "@/components/common/CommonDialog";
import ScrollToTop from "@/pages/main-layout/components/ScrollToTop";
import { Footer } from "@/pages/main-layout/components/Footer";

export const StudentLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="fixed top-0 left-0 right-0 z-50">
        <Header />
      </header>
      {/* 給內容留出 Header 高度，flex-1 讓主內容區域佔滿剩餘空間 */}
      <main className="mt-14 md:mt-16 flex-1 flex flex-col">
        <div className="flex-1">
          <Outlet />
        </div>
        <Toaster />
        <CommonDialog />
        <ScrollToTop />
      </main>
      <Footer />
    </div>
  );
};
