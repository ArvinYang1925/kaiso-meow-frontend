import { FC, useState, useEffect } from "react";
import ExpertRecommendationCard from "../../../../components/ExpertRecommendationCard";
import { expertRecommendations } from "@/pages/student/home-page/data/expertRecommendations";

const ExpertRecommendationComponent: FC = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate data fetching
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000); // Simulate 1 second loading time

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-x-12 gap-y-24">
      {isLoading
        ? Array.from({ length: 4 }).map((_, index) => (
            <ExpertRecommendationCard key={index} name="" role="" description="" imageSrc="" isLoading={true} />
          ))
        : expertRecommendations.map((expert, index) => (
            <ExpertRecommendationCard key={index} {...expert} />
          ))}
    </div>
  );
};

export default ExpertRecommendationComponent;
