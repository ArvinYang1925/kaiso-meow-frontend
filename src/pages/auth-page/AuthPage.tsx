import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");

  return (
    <div className="flex items-center justify-center">
      <Card className="w-full max-w-md rounded-xl shadow-lg overflow-hidden">
        {/* Tabs */}
        <div className="flex">
          {/* 登入按鈕 */}
          <button
            onClick={() => setActiveTab("login")}
            className={`w-1/2 py-3 text-center font-medium relative bg-orange-600 text-white ${
              activeTab === "login" ? "text-orange-400" : "text-gray-500"
            }`}
          >
            登入
            {activeTab === "login" && (
              <div className="absolute top-0 left-0 w-full h-1 bg-orange-600" />
            )}
          </button>
          {/* 註冊按鈕 */}
          <button
            onClick={() => setActiveTab("register")}
            className={`w-1/2 py-3 text-center font-medium relative ${
              activeTab === "register" ? "text-orange-600" : "text-gray-500"
            }`}
          >
            註冊
            {activeTab === "register" && (
              <div className="absolute top-0 left-0 w-full h-1 bg-orange-600" />
            )}
          </button>
        </div>

        {/* Content */}
        <CardContent className="p-6">
          {activeTab === "login" ? <LoginForm /> : <RegisterForm />}
        </CardContent>
      </Card>
    </div>
  );
}
