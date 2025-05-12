import { FC } from "react";
import decorationSvg from "@/assets/homepage/decoration.svg";
import ExpertRecommendationCard from "../../../../components/ExpertRecommendationCard";
import { expertRecommendations } from "@/pages/student/home-page/data/expertRecommendations";

const ExpertRecommendationComponent: FC = () => {
  return (
    <section className="py-16 relative overflow-hidden">
      {/* Yellow dot pattern decorations */}
      <div className="absolute top-0 left-0 w-48 h-48 opacity-100">
        <img src={decorationSvg} alt="Decoration" className="w-full h-full" />
      </div>
      <div className="absolute bottom-0 right-0 w-48 h-48 opacity-100">
        <img src={decorationSvg} alt="Decoration" className="w-full h-full" />
      </div>

      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold mb-2">專家推薦</h2>
          <div className="w-12 h-1 bg-black mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {expertRecommendations.map((expert, index) => (
            <ExpertRecommendationCard key={index} {...expert} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExpertRecommendationComponent;
