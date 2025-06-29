import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import iconsToTop from "@/assets/homepage/icons-to-top.svg";

// 按下就可跳轉到最上方的懸浮右下角按紐
const ScrollToTop: React.FC = () => {
  const location = useLocation();
  const [showButton, setShowButton] = useState(false);

  // 處理頁面切換時的滾動
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  // 監聽滾動事件，控制按鈕顯示
  useEffect(() => {
    const handleScroll = () => {
      setShowButton(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 處理滾動到頂部的點擊事件
  const scrollToTop = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return showButton ? (
    <a
      href="#"
      onClick={scrollToTop}
      className="fixed bottom-10 right-8 z-50 hover:opacity-80 transition-opacity"
    >
      <img className="w-12 h-12" src={iconsToTop} alt="回到頂部" />
    </a>
  ) : null;
};

export default ScrollToTop;
