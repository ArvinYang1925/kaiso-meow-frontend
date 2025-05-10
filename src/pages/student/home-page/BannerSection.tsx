import { FC, Fragment, useEffect, useState } from "react";
// 第三方套件
import { Swiper } from "swiper";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
// 內建資料引入
import { bannerData, bannerMobileData } from "./bannerStore";
import banner_next from "@/assets/homepage/banner-next.svg";
import banner_prev from "@/assets/homepage/banner-prev.svg";

const BannerSection: FC = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1200);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1200);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    new Swiper(".banner-swiper", {
      modules: [Navigation, Pagination, Autoplay],
      slidesPerView: 1,
      spaceBetween: 240,
      loop: true,
      autoplay: {
        delay: 4000,
        disableOnInteraction: false,
      },
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
      },
    });
  }, []);

  const BannerData = isMobile ? bannerMobileData : bannerData;

  return (
    <section className="index-banner-section w-full">
      <div
        className={`swiper banner-swiper ${
          isMobile ? "h-[566px]" : "h-[800px]"
        }`}
      >
        <div className="swiper-wrapper">
          {BannerData.map((banner) => (
            <div key={banner.id} className="swiper-slide">
              <div className="w-full h-full">
                <div className="relative w-full h-full">
                  <img
                    src={banner.imgSrc}
                    alt={banner.imgAlt}
                    className="w-full h-full object-cover"
                    style={{ aspectRatio: isMobile ? "16/9" : "21/9" }}
                  />
                  {isMobile ? (
                    // 手機板
                    <div className="absolute top-0 left-0 w-full h-1/2 flex flex-col justify-end px-4">
                      <div className="w-full max-w-[335px] flex flex-col mx-auto">
                        <h1 className="title text-black font-medium text-xl text-left w-full">
                          {banner.title.split("\n").map((line, idx) => (
                            <Fragment key={idx}>
                              {line}
                              <br />
                            </Fragment>
                          ))}
                        </h1>
                        <p className="text-slate-500 font-normal text-[18px] mt-2 text-left w-full">
                          {banner.description.split("\n").map((line, idx) => (
                            <Fragment key={idx}>
                              {line}
                              <br />
                            </Fragment>
                          ))}
                        </p>
                      </div>
                    </div>
                  ) : (
                    // 電腦版
                    <div className="absolute top-0 left-0 w-1/2 h-full flex flex-col justify-center px-8">
                      <div className="ml-auto w-full max-w-[523px] flex flex-col">
                        <h1 className="title text-black font-black text-4xl text-left w-full">
                          {banner.title.split("\n").map((line, idx) => (
                            <Fragment key={idx}>
                              {line}
                              <br />
                            </Fragment>
                          ))}
                        </h1>
                        <p className="text-slate-500 font-normal text-[20px] mt-4 mt-xl-6 text-left w-full">
                          {banner.description.split("\n").map((line, idx) => (
                            <Fragment key={idx}>
                              {line}
                              <br />
                            </Fragment>
                          ))}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="swiper-pagination swiper-pagination-brand-01"></div>
        <div className="swiper-button-prev hidden xl:block">
          <img src={banner_prev} alt="上一張" className="w-10 h-10" />
        </div>
        <div className="swiper-button-next hidden xl:block">
          <img src={banner_next} alt="下一張" className="w-10 h-10" />
        </div>
      </div>
    </section>
  );
};

export default BannerSection;
