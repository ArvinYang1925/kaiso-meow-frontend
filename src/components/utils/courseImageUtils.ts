import { useState, useCallback, useEffect } from "react";

/**
 * 預設課程封面圖片 URL
 */
export const DEFAULT_COURSE_COVER = "https://firebasestorage.googleapis.com/v0/b/kaiso-meow-backend.firebasestorage.app/o/images%2Fcourse_cover%2Fdefault_cover%2Fdefault_lesson_cover.png?alt=media&token=9e27fcc9-5a48-4e9b-b876-d0cdeb2230fd";

/**
 * 取得課程封面圖片 URL，如果沒有則返回預設圖片
 * @param coverUrl - 課程封面 URL
 * @returns 有效的圖片 URL
 */
export const getCourseCoverUrl = (coverUrl?: string | null): string => {
  return coverUrl && coverUrl.trim() !== "" ? coverUrl : DEFAULT_COURSE_COVER;
};

/**
 * 驗證圖片 URL 是否有效
 * @param url - 圖片 URL
 * @returns Promise<boolean> - 圖片是否可以正常載入
 */
export const validateImageUrl = async (url: string): Promise<boolean> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = url;
  });
};

/**
 * React Hook: 處理圖片載入錯誤的自動回退
 * @param src - 原始圖片 URL
 * @returns [currentSrc, handleError] - 當前使用的圖片 URL 和錯誤處理函數
 */
export const useImageWithFallback = (src?: string | null): [string, () => void] => {
  const [currentSrc, setCurrentSrc] = useState<string>(() => getCourseCoverUrl(src));
  
  const handleError = useCallback(() => {
    setCurrentSrc(prevSrc => {
      // 只有當前圖片不是預設圖片時才切換
      return prevSrc !== DEFAULT_COURSE_COVER ? DEFAULT_COURSE_COVER : prevSrc;
    });
  }, []);
  
  useEffect(() => {
    const newSrc = getCourseCoverUrl(src);
    setCurrentSrc(prevSrc => {
      return prevSrc !== newSrc ? newSrc : prevSrc;
    });
  }, [src]);
  
  return [currentSrc, handleError];
};