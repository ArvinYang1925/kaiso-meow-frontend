import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import logo from "@/assets/catschool_logo.svg";
import { useNavigate } from "react-router-dom";

interface CourseCardProps {
  id: string;
  title: string;
  instructorName: string;
  coverUrl: string;
  price: number;
  isReady: boolean;
}

export const CourseCard: React.FC<CourseCardProps> = ({
  id,
  title,
  instructorName,
  coverUrl,
  price,
  isReady,
}) => {
  const navigate = useNavigate();

  return (
    <div className="w-full rounded-lg shadow-md bg-white overflow-hidden flex flex-col">
      {/* 圖片區塊 */}
      <div className="relative">
        <img
          src={coverUrl}
          alt="React Frontend Course"
          className="w-full h-66 object-cover"
        />
        {!isReady && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-orange-200 text-orange-800 px-4 py-2 rounded-lg font-medium">
              課程準備中
            </div>
          </div>
        )}
      </div>

      {/* 內容區塊 */}
      <div className="flex flex-col gap-4 p-4 flex-1">
        {/* 小標題 */}
        <h4 className="text-lg font-semibold text-gray-900">{title}</h4>

        {/* Logo */}
        <div className="logo-section flex items-center">
          <Avatar className="cursor-pointer p-1 ring-1 ring-gray-300 me-2">
            <AvatarImage className="scale-x-[-1]" src={logo} />
          </Avatar>
          <h5>{instructorName}</h5>
        </div>

        {/* 價格與按鈕 */}
        <div className="flex items-center justify-between mt-auto">
          <span className="text-xl font-bold text-sky-600">
            NT$ {price.toLocaleString() ?? ""}
          </span>
          <Button
            variant="outline"
            className={`bg-orange-500 text-white hover:bg-orange-600 hover:text-gray ${
              !isReady ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={!isReady}
            onClick={() => {
              if (isReady) {
                navigate(`/course/${id}`);
              }
            }}
          >
            {isReady ? "查看詳情" : "課程準備中"}
          </Button>
        </div>
      </div>
    </div>
  );
};

// export default CourseCard;
