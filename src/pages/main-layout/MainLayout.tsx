import { ReactNode } from "react";
import { Header } from "@/components/layout/Header";

interface MainLayoutProps {
    children: ReactNode; // children 是 React 的內建型別
  }

export const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <>
      <Header />
      <main className="pt-16">{children}</main> {/* 給內容留出 Header 高度 */}
    </>
  );
};
