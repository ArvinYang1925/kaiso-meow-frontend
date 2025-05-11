import { useEffect } from "react";
import { useAuthStore } from "@/stores/authStore";
import ExpertRecommendationSection from "@/components/ExpertRecommendationSection";
import CourseCardListComponent from "./components/CourseCardListComponent";
import NewsLetterComponent from "./components/NewsletterComponent";
import BannerComponent from "./components/BannerComponent";
import { Footer } from "@/pages/main-layout/components/Footer";

export const HomePage: React.FC = () => {
  const { userInfo } = useAuthStore();

  useEffect(() => {
    // if (userInfo) {
    //   setUserName(userInfo.name);
    // }
  }, [userInfo]);

  return (
    <>
      <BannerComponent />
      <div className="container">
        {/* 課程卡片區塊 */}
        <CourseCardListComponent />
        {/* 專家推薦區塊 */}
        <ExpertRecommendationSection />
        {/* 電子報訂閱區塊 */}
        <NewsLetterComponent />
      </div>
      <Footer />
    </>
  );
};

export default HomePage; //?
