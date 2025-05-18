import { useEffect } from "react";
// import { useAuthStore } from "@/stores/authStore";
import ExpertRecommendationComponent from "@/pages/student/home-page/components/ExpertRecommendationComponent";
import CourseCardListComponent from "./components/CourseCardListComponent";
import NewsLetterComponent from "./components/NewsletterComponent";
import BannerComponent from "./components/BannerComponent";
// import { useHomePageStore } from "./store/homePageStore";
import InstructorIntroComponent from "./components/InstructorIntroComponent";
import decorationSvg from "@/assets/homepage/decoration.svg";

export const HomePage: React.FC = () => {
  useEffect(() => {
    // fetchCourseCardList();
  }, []);

  return (
    <>
      <BannerComponent />
      <div className="container">
        {/* 課程卡片區塊 */}
        <div className="mt-24 course-card-section">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold mb-2">所有課程</h2>
            <div className="w-12 h-1 bg-black mx-auto"></div>
          </div>
          <CourseCardListComponent />
        </div>
      </div>
      <div className="relative">
        <div className="absolute left-[94px] top-[168px] w-[452px] h-[452px] z-0 pointer-events-none hidden md:block">
          <img src={decorationSvg} alt="Decoration" className="w-full h-full" />
        </div>
        {/* 講師介紹區塊 */}
        <div className="container relative z-10">
          <InstructorIntroComponent />
        </div>
      </div>
      <div className="container">
        {/* 專家推薦區塊 */}
        <ExpertRecommendationComponent />
        {/* 電子報訂閱區塊 */}
        <NewsLetterComponent />
      </div>
    </>
  );
};

export default HomePage; //?
