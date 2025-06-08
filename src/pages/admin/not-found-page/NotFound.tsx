import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ADMIN_ROUTES } from "@/app/route-path";
import Backend404 from "@/assets/backend_404.png";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center px-4 py-8 bg-white">
      <div className="flex flex-col items-center gap-6 md:gap-8 w-full max-w-4xl bg-white rounded-2xl p-6 md:p-8 shadow-sm">
        <div className="w-full max-w-[700px] h-[200px] sm:h-[250px] md:h-[300px] lg:h-[350px] rounded-2xl overflow-hidden flex items-center justify-center p-4 sm:p-6 md:p-8">
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `url(${Backend404})`,
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              backgroundSize: "contain",
            }}
          />
        </div>
        <Button
          className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 text-sm md:text-base"
          onClick={() => navigate(ADMIN_ROUTES.HOME)}
        >
          返回首頁
        </Button>
      </div>
    </div>
  );
}
