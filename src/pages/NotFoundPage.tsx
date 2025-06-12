import React from "react";
import { useNavigate } from "react-router-dom";
import Front404Image from "@/assets/front_404.png";

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="p-0 text-center mx-auto my-8 max-w-4xl relative">
      <div className="relative w-full h-[500px]">
        <img
          src={Front404Image}
          alt="404 Error"
          className="w-full h-full object-contain rounded-lg"
        />
        <div className="absolute bottom-[calc(10%-40px)] left-1/2 -translate-x-1/2 text-center">
          <button
            className="text-white bg-orange-600 border-none px-6 py-3 rounded-lg text-base cursor-pointer shadow-md hover:bg-orange-700 transition-colors"
            onClick={() => navigate("/")}
          >
            回到首頁
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
