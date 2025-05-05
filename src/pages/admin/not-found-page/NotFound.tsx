import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ADMIN_ROUTES } from "@/app/route-path";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)]">
      <div className="text-center space-y-4">
        <h1 className="text-6xl font-bold text-gray-900">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700">頁面不存在</h2>
        <p className="text-gray-500">抱歉，您訪問的頁面不存在</p>
        <Button onClick={() => navigate(ADMIN_ROUTES.HOME)} className="mt-4">
          返回首頁
        </Button>
      </div>
    </div>
  );
}
