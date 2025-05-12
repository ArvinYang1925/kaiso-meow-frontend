import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import logo from "@/assets/catschool_logo.svg";

interface CourseCardProps {
  // id: string;
  title: string;
  instructorName: string;
  coverUrl: string;
  price: string;
}

export const CourseCard: React.FC<CourseCardProps> = ({
  title,
  // instructorName,
  coverUrl,
  price,
}) => {
  return (
    <div className="w-[394px] h-[443px] rounded-lg shadow-md bg-white overflow-hidden flex flex-col">
      {/* 圖片區塊 */}
      <img
        src={coverUrl}
        alt="React Frontend Course"
        className="w-full h-66 object-cover"
      />

      {/* 內容區塊 */}
      <div className="flex flex-col gap-4 p-4 flex-1">
        {/* 小標題 */}
        <h4 className="text-lg font-semibold text-gray-900">{title}</h4>

        {/* Logo */}
        <div className="logo-section flex items-center">
          <Avatar className="cursor-pointer p-1 ring-1 ring-gray-300 me-2">
            <AvatarImage className="scale-x-[-1]" src={logo} />
          </Avatar>
          <h5>程式喵</h5>
        </div>

        {/* 價格與按鈕 */}
        <div className="flex items-center justify-between mt-auto">
          <span className="text-xl font-bold text-sky-600">NT$ {price}</span>
          <Button
            variant="outline"
            className="bg-orange-500 text-white hover:bg-orange-600 hover:text-gray"
          >
            查看詳情
          </Button>
        </div>
      </div>
    </div>
  );
};

// export default CourseCard;
