import React, { useState, useEffect, useCallback } from "react";

interface AdMarqueeProps {
  adTexts: string[];
  position: "top" | "bottom";
  scrollSpeed?: number;
  textInterval?: number;
  backgroundColor?: string;
  textColor?: string;
  height?: number;
  onClick?: (text: string, index: number) => void;
  onClose?: () => void;
  storageKey: string;
}

export const AdMarquee: React.FC<AdMarqueeProps> = ({
  adTexts,
  position,
  scrollSpeed = 60,
  textInterval = 6000,
  backgroundColor,
  textColor = "#ffffff",
  height = 45,
  onClick,
  onClose,
  storageKey,
}) => {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [topPosition, setTopPosition] = useState("56px");

  // 根據位置設定不同的背景色
  const getBackgroundColor = () => {
    if (backgroundColor) return backgroundColor;

    if (position === "top") {
      // 頂部跑馬燈：從左側紫色到右側橘色的漸變
      return "linear-gradient(90deg, #7C3AED 0%, #8B5CF6 20%, #A855F7 40%, #EC4899 60%, #F97316 80%, #EA580C 100%)";
    } else {
      // 底部跑馬燈：保持原來的橘紅色漸變
      return "linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)";
    }
  };

  // 監聽螢幕尺寸變化，動態調整頂部位置
  useEffect(() => {
    const updateTopPosition = () => {
      if (typeof window !== "undefined") {
        // 手機版：56px，桌面版：72px
        const newPosition = window.innerWidth < 768 ? "56px" : "72px";
        setTopPosition(newPosition);
      }
    };

    // 初始設定
    updateTopPosition();

    // 監聽視窗大小變化
    window.addEventListener("resize", updateTopPosition);

    return () => {
      window.removeEventListener("resize", updateTopPosition);
    };
  }, []);

  // 文字輪播
  useEffect(() => {
    if (adTexts.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentTextIndex((prev) => (prev + 1) % adTexts.length);
    }, textInterval);

    return () => clearInterval(interval);
  }, [adTexts.length, textInterval]);

  // 處理關閉
  const handleClose = useCallback(() => {
    setIsVisible(false);
    sessionStorage.setItem(storageKey, "true");
    if (onClose) {
      onClose();
    }
  }, [storageKey, onClose]);

  // 處理點擊
  const handleClick = useCallback(() => {
    if (onClick) {
      onClick(adTexts[currentTextIndex], currentTextIndex);
    }
  }, [onClick, adTexts, currentTextIndex]);

  if (!isVisible || adTexts.length === 0) {
    return null;
  }

  const positionStyles =
    position === "top"
      ? { top: topPosition } // 使用動態調整的 Header 高度
      : { bottom: 0 };

  return (
    <div
      style={{
        position: "fixed",
        left: 0,
        right: 0,
        ...positionStyles,
        height: `${height}px`,
        background: getBackgroundColor(),
        color: textColor,
        zIndex: 40, // 降低 z-index，確保不會覆蓋 Header
        overflow: "hidden",
        cursor: "default", // cursor: onClick ? 'pointer' : 'default'
      }}
      onClick={handleClick}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          position: "relative",
          padding: "0 60px 0 20px",
        }}
      >
        {/* 跑馬燈文字 */}
        <div
          style={{
            animation: `marquee ${scrollSpeed}s linear infinite`,
            whiteSpace: "nowrap",
            fontSize: "14px",
            fontWeight: "500",
            textShadow: "0 1px 2px rgba(0, 0, 0, 0.1)", // 添加文字陰影增加可讀性
          }}
        >
          {adTexts[currentTextIndex]}
        </div>

        {/* 關閉按鈕 - 所有跑馬燈都有關閉按鈕 */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleClose();
          }}
          style={{
            position: "absolute",
            right: "15px",
            top: "50%",
            transform: "translateY(-50%)",
            background: "rgba(255, 255, 255, 0.2)",
            border: "none",
            color: textColor,
            borderRadius: "50%",
            width: "24px",
            height: "24px",
            cursor: "pointer",
            fontSize: "12px",
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.2s ease",
            backdropFilter: "blur(4px)",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.3)";
            e.currentTarget.style.transform = "translateY(-50%) scale(1.1)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.2)";
            e.currentTarget.style.transform = "translateY(-50%) scale(1)";
          }}
          title="關閉廣告"
        >
          ✕
        </button>
      </div>

      {/* 跑馬燈動畫樣式 */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
          @keyframes marquee {
            0% {
              transform: translateX(100%);
            }
            100% {
              transform: translateX(-100%);
            }
          }
        `,
        }}
      />
    </div>
  );
};

export default AdMarquee;
