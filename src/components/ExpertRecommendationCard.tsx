import { FC } from "react";
import vector from "@/assets/homepage/vector.svg";
import { ExpertRecommendationData } from "@/pages/student/home-page/data/expertRecommendations";

type ExpertRecommendationCardProps = ExpertRecommendationData;

const ExpertRecommendationCard: FC<ExpertRecommendationCardProps> = ({
  name,
  role,
  description,
  imageSrc,
}) => {
  return (
    <div className="bg-gray-100 rounded-lg overflow-hidden shadow-sm p-6 relative">
      <div className="grid grid-cols-[2fr_3fr] gap-4">
        <div className="w-full h-full rounded-full overflow-visible">
          <img
            src={imageSrc}
            alt={name}
            className="w-full h-full object-cover transform scale-110"
          />
        </div>
        <div>
          <h3 className="text-xl font-bold">{name}</h3>
          <p className="text-gray-600 mb-3">{role}</p>
          <p className="text-sm text-gray-700 leading-relaxed">{description}</p>
        </div>
      </div>
      <div className="absolute -bottom-2 right-4 text-3xl text-gray-200 overflow-visible">
        <img src={vector} alt="vector" className="" />
      </div>
    </div>
  );
};

export default ExpertRecommendationCard;
