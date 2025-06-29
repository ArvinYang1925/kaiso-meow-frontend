import React from "react";
import { useNavigate } from "react-router-dom";
import { Lock } from "lucide-react";

const PermissionDeniedPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-screen bg-yellow-50 px-4">
      <div className="bg-white border border-yellow-300 rounded-xl p-10 shadow-lg text-center max-w-md w-full">
        <div className="flex flex-col items-center gap-4">
          <Lock size={48} className="text-yellow-600" />
          <h1 className="text-3xl font-bold text-yellow-700">權限不足</h1>
          <p className="text-lg text-yellow-800">
            您無查看此頁面的權限，請聯絡系統管理員。
          </p>
        </div>
        <button
          onClick={() => navigate("/")}
          className="mt-8 bg-yellow-600 hover:bg-yellow-700 text-white py-2 px-6 rounded transition"
        >
          回到首頁
        </button>
      </div>
    </div>
  );
};

export default PermissionDeniedPage;
