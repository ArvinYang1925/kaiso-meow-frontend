import { FC } from "react";
import { StudentRecommendation } from "@/pages/student/home-page/data/studentRecommendationData";
import Star from "@/assets/homepage/star.svg";
import FullStar from "@/assets/homepage/fullstar.svg";

const StudentRecommendationCard: FC<StudentRecommendation> = ({
  title,
  description,
  courseImageSrc,
  studentAvatarSrc,
  studentName,
  rating,
}) => {
  return (
    <>
      {/* 電腦版 */}
      <div className="hidden md:block">
        <div className="w-[616px] bg-white rounded-xl shadow border border-gray-200 p-0">
          <div className="flex items-stretch p-6 gap-0">
            <div className="basis-3/5 h-full rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
              <img
                src={courseImageSrc}
                alt={title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="basis-2/5 h-full flex flex-col justify-between ml-6 min-w-0 relative">
              <div>
                <h3 className="text-xl font-bold mb-2 truncate">{title}</h3>
                <div className="flex items-center gap-2 mb-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i}>
                      <img src={i < rating ? FullStar : Star} alt="star" />
                    </span>
                  ))}
                </div>
                <p className="text-gray-700 mb-4 whitespace-pre-line">
                  {description}
                </p>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="absolute right-0 bottom-0 m-6 flex items-center">
              <img
                src={studentAvatarSrc}
                alt={studentName}
                className="w-8 h-8 rounded-full object-cover"
              />
              <span className="text-gray-600 ml-[6px]">{studentName}</span>
            </div>
          </div>
        </div>
      </div>
      {/* 手機版 */}
      <div className="block md:hidden">
        <div className="w-[253px] h-[398px] bg-white rounded-xl shadow border border-gray-200 flex flex-col p-4 mx-auto">
          <div className="w-full h-[147.33px] rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center mb-4">
            <img src={courseImageSrc} alt={title} className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 flex flex-col justify-between min-w-0 relative">
            <div>
              <h3 className="text-lg leading-7 font-medium mb-3 truncate">{title}</h3>
              <div className="flex items-center gap-2 mb-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i}>
                    <img src={i < rating ? FullStar : Star} alt="star" />
                  </span>
                ))}
              </div>
              <p className="text-state-700 mb-3 whitespace-pre-line text-sm leading-5 font-normal">{description}</p>
            </div>
            <div className="flex items-center mt-3 justify-end">
              <img src={studentAvatarSrc} alt={studentName} className="w-8 h-8 rounded-full object-cover" />
              <span className="text-state-400 ml-2 text-xs">{studentName}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default StudentRecommendationCard;
