import { Avatar, AvatarImage } from "@/components/ui/avatar";
import logo from "@/assets/catschool_logo.svg";
import { useNavigate } from "react-router-dom";
import { MyCourse } from "@/types/course";
import { Card } from "@/components/ui/card";

interface MyLearningCourseCardProps extends MyCourse {
  isLoading?: boolean;
}

export const MyLearningCourseCard: React.FC<MyLearningCourseCardProps> = ({
  courseId,
  title,
  coverUrl,
  progressPercentage,
  instructorName,
  isLoading = false,
}) => {
  const navigate = useNavigate();

  // Function to get progress bar color based on percentage
  const getProgressColor = (percentage: number) => {
    if (percentage >= 90) return "bg-green-500";
    if (percentage >= 60) return "bg-blue-500";
    if (percentage >= 30) return "bg-yellow-500";
    return "bg-gray-400";
  };

  return (
    <Card isLoading={isLoading} className="w-full rounded-lg shadow-md bg-white overflow-hidden flex flex-col cursor-pointer hover:shadow-lg transition-shadow">
      {/* 圖片區塊 */}
      <img src={coverUrl} alt={title} className="w-full h-66 object-cover" />

      {/* 內容區塊 */}
      <div className="flex flex-col gap-4 p-4 flex-1">
        {/* 課程標題 */}
        <h4 className="text-lg font-semibold text-gray-900">{title}</h4>

        {/* Logo */}
        <div className="logo-section flex items-center">
          <Avatar className="cursor-pointer p-1 ring-1 ring-gray-300 me-2">
            <AvatarImage className="scale-x-[-1]" src={logo} />
          </Avatar>
          <h5 className="text-sm text-gray-600">{instructorName}</h5>
        </div>

        {/* 進度條 */}
        <div className="progress-section mt-auto">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">已完成</span>
            <span className="text-sm font-semibold text-gray-800">
              {progressPercentage}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(
                progressPercentage
              )}`}
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          {/* 按鈕 */}
          <div className="mt-4">
            <button
              className="w-full bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-600 transition-colors"
              onClick={() => {
                // Navigate to first section of the course for now
                // In production, you might want to navigate to the last viewed section
                navigate(`/my-learning/${courseId}/section/first`);
              }}
            >
              繼續學習
            </button>
          </div>
        </div>
      </div>
    </Card>
  );
};
