import { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import StudentRecommendationCard from "@/components/features/StudentRecommendationCard";
import { studentRecommendations } from "@/pages/student/home-page/data/studentRecommendationData";
import { FC } from "react";
import carouselNext from "@/assets/homepage/banner-next.svg";
import carouselPrev from "@/assets/homepage/banner-prev.svg";

const StudentRecommendationsComponent: FC = () => {
  const swiperRef = useRef<SwiperType | null>(null);

  const handlePrevSlide = () => {
    if (!swiperRef.current) return;
    if (swiperRef.current.isBeginning) {
      swiperRef.current.slideTo(swiperRef.current.slides.length - 1);
    } else {
      swiperRef.current.slidePrev();
    }
  };

  const handleNextSlide = () => {
    if (!swiperRef.current) return;
    if (swiperRef.current.isEnd) {
      swiperRef.current.slideTo(0);
    } else {
      swiperRef.current.slideNext();
    }
  };

  return (
    <section className="relative overflow-hidden mb-32 bg-slate-50 py-[48px] md:py-[144px]">
      {/* Swiper 外層 RWD 寬度 */}
      <div className="w-full max-w-[375px] mx-auto md:w-[1280px] md:max-w-[1280px] relative">
        {/* 左箭頭 */}
        <div
          className="hidden md:flex absolute top-1/2 left-0 -translate-y-1/2 -translate-x-full"
          style={{ marginLeft: "-48px" }}
        >
          <img
            src={carouselPrev}
            onClick={handlePrevSlide}
            role="button"
            tabIndex={0}
            aria-label="上一張"
            className="w-8 h-8 cursor-pointer"
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                handlePrevSlide();
              }
            }}
          />
        </div>
        {/* 右箭頭 */}
        <div
          className="hidden md:flex absolute top-1/2 right-0 -translate-y-1/2 translate-x-full"
          style={{ marginRight: "-48px" }}
        >
          <img
            src={carouselNext}
            onClick={handleNextSlide}
            role="button"
            tabIndex={0}
            aria-label="下一張"
            className="w-8 h-8 cursor-pointer"
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                handleNextSlide();
              }
            }}
          />
        </div>
        <Swiper
          slidesPerView={1.5}
          spaceBetween={16}
          className="w-full"
          breakpoints={{
            768: { slidesPerView: 2, spaceBetween: 48 },
          }}
          onSwiper={(swiper) => (swiperRef.current = swiper)}
        >
          {studentRecommendations.map((item) => (
            <SwiperSlide key={item.id} className="h-full flex">
              <StudentRecommendationCard {...item} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default StudentRecommendationsComponent;
