import { useEffect } from "react";
// import { useAuthStore } from "@/stores/authStore";
import ExpertRecommendationComponent from "@/pages/student/home-page/components/ExpertRecommendationComponent";
import CourseCardListComponent from "./components/CourseCardListComponent";
import NewsLetterComponent from "./components/NewsletterComponent";
import BannerComponent from "./components/BannerComponent";
// import { useHomePageStore } from "./store/homePageStore";
import decorationSvg from "@/assets/homepage/decoration.svg";
import InstructorIntroComponent from "./components/InstructorIntroComponent";
import topLeftDecor from "@/assets/homepage/top-left-course-card.png";
import bottomRightDecor from "@/assets/homepage/right-down-course-card.png";
import StudentRecommendationsComponent from "./components/studentRecommendationsComponent";

export const HomePage: React.FC = () => {
  useEffect(() => {
    // fetchCourseCardList();
  }, []);

  return (
    <>
      <BannerComponent />
      {/* 課程卡片區塊 */}
      <div
        className="py-24 course-card-section bg-slate-50"
        style={{
          backgroundImage: `url(${topLeftDecor}), url(${bottomRightDecor})`,
          backgroundPosition: "left top, right bottom",
          backgroundSize: "376px 873px, 824px 767px",
          backgroundRepeat: "no-repeat, no-repeat",
        }}
      >
        <div className="container">
          <div className="text-center mb-12 bg-no-repeat">
            <h2 className="text-2xl font-bold mb-2">強打課程</h2>
            <div className="w-12 h-1 bg-black mx-auto"></div>
          </div>
          <CourseCardListComponent />
        </div>
      </div>

      {/* 講師介紹區塊 */}
      <InstructorIntroComponent />
      {/* 學員推薦區塊 */}
      <StudentRecommendationsComponent />

      {/* 專家推薦區塊 */}
      <div
        className="expert-card-section"
        style={{
          backgroundImage: `url(${decorationSvg}), url(${decorationSvg})`,
          backgroundPosition:
            "-180px -180px, calc(100% + 192px) calc(100% + 300px)",
          backgroundSize: "480px 480px, 600px 600px",
          backgroundRepeat: "no-repeat, no-repeat",
        }}
      >
        <div className="container py-32">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold mb-2">專家推薦</h2>
            <div className="w-12 h-1 bg-black mx-auto"></div>
          </div>
          <ExpertRecommendationComponent />
        </div>
      </div>

      {/* 電子報訂閱區塊 */}
      <NewsLetterComponent />
    </>
  );
};

export default HomePage;
