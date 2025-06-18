import { useEffect, useState, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import coupon_0714 from "@/assets/homepage/coupon_0714.png";
// 可以添加第二張廣告圖片，暫時用同一張示範
import coupon_0722 from "@/assets/homepage/coupon_0714.png";

interface ShowAdProps {
  adImages?: string[];
  /** 延遲顯示時間（毫秒），預設2秒 */
  showDelay?: number;
  /** 圖片切換間隔時間（毫秒），預設4秒 */
  slideInterval?: number;
  /** 是否只在首頁顯示，預設true */
  onlyHomePage?: boolean;
}

export const ShowAd: React.FC<ShowAdProps> = ({
  adImages = [coupon_0714, coupon_0722],
  showDelay = 2000,
  slideInterval = 4000,
  onlyHomePage = true,
}) => {
  const location = useLocation();
  const [adOpen, setAdOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  const shouldShowAd = useMemo(() => {
    if (onlyHomePage) {
      // 檢查是否為首頁且是新的頁面載入
      return (
        location.pathname === "/" && !sessionStorage.getItem("homeAdShown")
      );
    }
    // 如果不限制首頁，則檢查是否已顯示過
    return !sessionStorage.getItem("homeAdShown");
  }, [location.pathname, onlyHomePage]);

  // 自動顯示廣告
  useEffect(() => {
    if (shouldShowAd) {
      const timer = setTimeout(() => {
        setAdOpen(true);
        // 標記已顯示過廣告（在當前 session 中）
        sessionStorage.setItem("homeAdShown", "true");
      }, showDelay);

      return () => clearTimeout(timer);
    }
  }, [shouldShowAd, showDelay]);

  // 廣告圖片自動輪播
  useEffect(() => {
    if (adOpen && adImages.length > 1) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % adImages.length);
      }, slideInterval);

      return () => clearInterval(interval);
    }
  }, [adOpen, adImages.length, slideInterval]);

  // 切換到上一張圖片
  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + adImages.length) % adImages.length);
  };

  // 切換到下一張圖片
  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % adImages.length);
  };

  // 切換到指定圖片
  const handleSlideChange = (index: number) => {
    setCurrentSlide(index);
  };

  // 關閉廣告
  const handleClose = () => {
    setAdOpen(false);
  };

  return (
    <Dialog open={adOpen} onOpenChange={setAdOpen}>
      <DialogContent className="max-w-fit p-0 border-0 bg-transparent shadow-none">
        <div className="relative flex items-center">
          {/* 左側切換按鈕 */}
          {adImages.length > 1 && (
            <button
              onClick={handlePrevSlide}
              className="w-12 h-32 bg-black/20 hover:bg-white/50 transition-colors flex items-center justify-center group rounded-l-lg mr-2"
            >
              <span className="text-white text-2xl opacity-50 group-hover:opacity-100 transition-opacity">
                ←
              </span>
            </button>
          )}

          {/* 圖片容器 */}
          <div className="relative">
            <img
              src={adImages[currentSlide]}
              alt={`廣告圖片 ${currentSlide + 1}`}
              className="max-w-[80vw] max-h-[90vh] object-contain transition-opacity duration-500"
            />

            {/* 圓點指示器 */}
            {adImages.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                {adImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => handleSlideChange(index)}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === currentSlide ? "bg-white" : "bg-white/50"
                    }`}
                  />
                ))}
              </div>
            )}

            {/* 關閉按鈕 */}
            <button
              onClick={handleClose}
              className="absolute top-2 right-2 w-8 h-8 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70 transition-colors text-lg font-bold"
            >
              ✕
            </button>
          </div>

          {/* 右側切換按鈕 */}
          {adImages.length > 1 && (
            <button
              onClick={handleNextSlide}
              className="w-12 h-32 bg-black/20 hover:bg-white/50 transition-colors flex items-center justify-center group rounded-r-lg ml-2"
            >
              <span className="text-white text-2xl opacity-50 group-hover:opacity-100 transition-opacity">
                →
              </span>
            </button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShowAd;
