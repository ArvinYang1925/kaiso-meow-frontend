import { FC } from "react";
import ExpertRecommendationCard from "../../../../components/ExpertRecommendationCard";
import { expertRecommendations } from "@/pages/student/home-page/data/expertRecommendations";

const ExpertRecommendationComponent: FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-x-12 gap-y-24">
      {expertRecommendations.map((expert, index) => (
        <ExpertRecommendationCard key={index} {...expert} />
      ))}
    </div>
  );
};

export default ExpertRecommendationComponent;
