import { CouponInfo } from "@/pages/student/order-page/service/type"; // 根據實際路徑調整
import { CouponType } from "@/lib/enum";

/**
 * 格式化金額為新台幣顯示格式（含千分位）
 *
 * @param {number | null | undefined} price - 要格式化的金額，可為 null 或 undefined
 * @returns {string} 格式化後的字串（如 NT$1,000），若無金額則回傳空字串
 *
 * @example
 * formatPrice(12000); // "NT$12,000"
 * formatPrice(null);  // ""
 */
export const formatPrice = (price?: number | null) =>
  price != null ? `NT$${price.toLocaleString()}` : "";

/**
 * 計算百分比折扣後的價格字串（含千分位逗號）
 * @param {number} originalPrice - 原價
 * @param {string} percent - 折扣百分比（字串格式）
 * @returns {string} 折扣金額（字串格式，含千分位）
 */
export const calculatePercentageDiscount = (
  originalPrice: number,
  percent: string
): string => {
  const discountPrice = originalPrice * (Number(percent) / 100);
  return Math.round(discountPrice).toLocaleString();
};

/**
 * 格式化 coupon 折扣字串（可處理固定金額或百分比折扣）
 * @param {number} originalPrice - 原價
 * @param {CouponInfo} coupon - 折扣資料物件
 * @returns {string} 格式化後的折扣字串（如 "-NT$1,000" 或 "-NT500"）
 */
export const formatCouponDiscount = (
  originalPrice: number | null,
  coupon: CouponInfo
): string => {
  if (!coupon?.value || !coupon.type || !originalPrice) return "";

  if (coupon.type === CouponType.FIXED) {
    return `-NT$${Number(coupon.value).toLocaleString()}`;
  }

  if (coupon.type === CouponType.PERCENTAGE) {
    return `-NT${calculatePercentageDiscount(originalPrice, coupon.value)}`;
  }

  return "";
};

/**
 * 取得折扣說明標籤字串（如：折扣50元、折扣20%）
 * @param {CouponInfo} coupon - 折扣資料物件
 * @returns {string} 折扣標籤字串
 */
export const handleCouponTypeLabel = (couponData: CouponInfo) => {
  const { type, value, couponName } = couponData || {};
  if (type == "fixed") {
    return `${couponName} (折扣${value}元)`;
  } else if (type == "percentage") {
    return `${couponName} (折扣${parseInt(value)}%)`;
  } else {
    return "";
  }
};
