import banner_desktop_01 from "@/assets/homepage/banner_desktop_01.jpg";
import banner_desktop_02 from "@/assets/homepage/banner_desktop_02.jpg";
import banner_desktop_03 from "@/assets/homepage/banner_desktop_03.jpg";
import banner_mobile_01 from "@/assets/homepage/banner_mobile_01.jpg";
import banner_mobile_02 from "@/assets/homepage/banner_mobile_02.jpg";
import banner_mobile_03 from "@/assets/homepage/banner_mobile_03.jpg";

const baseBannerContent = [
  {
    id: 1,
    title: "編寫未來，\n從程式喵的專業課程開始!",
    description: "讓你掌握前後端開發與系統架構設計，\n打造屬於自己的科技未來!",
    mobileDescription:
      "讓你掌握前後端開發與系統架構設計，\n打造屬於自己的科技未來!",
  },
  {
    id: 2,
    title: "學程式，找程式喵\n讓你的程式設計更流暢!",
    description:
      "不只教寫程式，更教你如何優化程式碼、提升開發效率，\n讓你的程式設計更專業!",
    mobileDescription:
      "不只教寫程式，\n更教你如何優化程式碼、提升開發效率，\n讓你的程式設計更專業!",
  },
  {
    id: 3,
    title: "從零開始，\n讓程式喵陪你寫出每行程式碼!",
    description:
      "循序漸進的課程設計，從基礎到高階，\n幫助你掌握程式開發的核心技能，讓學習更輕鬆有趣!",
    mobileDescription:
      "循序漸進的課程設計，從基礎到高階，\n幫助你掌握程式開發的核心技能，\n讓學習更輕鬆有趣!",
  },
];

const desktopImages = [
  { imgSrc: banner_desktop_01, imgAlt: "banner-illustration-1" },
  { imgSrc: banner_desktop_02, imgAlt: "banner-illustration-2" },
  { imgSrc: banner_desktop_03, imgAlt: "banner-illustration-3" },
];

const mobileImages = [
  { imgSrc: banner_mobile_01, imgAlt: "banner-mobile-illustration-1" },
  { imgSrc: banner_mobile_02, imgAlt: "banner-mobile-illustration-2" },
  { imgSrc: banner_mobile_03, imgAlt: "banner-mobile-illustration-3" },
];

const bannerData = baseBannerContent.map((content, index) => ({
  ...content,
  ...desktopImages[index],
  description: content.description,
}));

const bannerMobileData = baseBannerContent.map((content, index) => ({
  ...content,
  ...mobileImages[index],
  description: content.mobileDescription,
}));

export { bannerData, bannerMobileData };
