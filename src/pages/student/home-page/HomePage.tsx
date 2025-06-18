/** 頁面元件 */
import BannerComponent from "./components/BannerComponent";
import CourseCardListComponent from "./components/CourseCardListComponent";
import InstructorIntroComponent from "./components/InstructorIntroComponent";
import StudentRecommendationsComponent from "./components/studentRecommendationsComponent";
import ExpertRecommendationComponent from "@/pages/student/home-page/components/ExpertRecommendationComponent";
import NewsLetterComponent from "./components/NewsletterComponent";
/** 頁面裝飾圖片 */
import decorationSvg from "@/assets/homepage/decoration.svg";
import topLeftDecor from "@/assets/homepage/top-left-course-card.png";
import bottomRightDecor from "@/assets/homepage/right-down-course-card.png";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
/** 廣告燈箱 */
import ShowAd from "@/components/common/ShowAd";

export const HomePage: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const target = document.querySelector(location.hash);
      if (target) {
        target.scrollIntoView({ behavior: "smooth" }); // 滑動到該區塊
      }
    }
  }, [location]);

  return (
    <>
      {/* 廣告燈箱 */}
      <ShowAd />
      {/* Banner區塊 */}
      <BannerComponent />
      {/* 課程卡片區塊 */}
      <div
        id="course-section"
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
