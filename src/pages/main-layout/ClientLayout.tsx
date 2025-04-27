import { ReactNode } from "react";
import { Header } from "./components/Header";

interface ClientLayoutProps {
  children: ReactNode; // children 是 React 的內建型別
}

export const ClientLayout = ({ children }: ClientLayoutProps) => {
  return (
    <>
      <Header />
      <main className="pt-16">{children}</main> {/* 給內容留出 Header 高度 */}
    </>
  );
};
