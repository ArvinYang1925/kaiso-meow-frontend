export type Coupon = {
  id: string;
  couponName: string;
  type: string;
  code: string;
  value: string;
  startsAt: string;
  expiresAt: string;
};

export type CreateCouponModel = {
  couponName: string;
  type: string;
  code: string;
  value: number;
  startsAt: Date;
  expiresAt: Date;
};

// AI 生成折扣碼的輸入參數類型
export type AiCouponGenerateRequest = {
  courseDescription: string;
  launchDate: string;
  numberOfPhases: number;
  discountType: "fixed" | "percentage";
  keywordThemes?: string; // 後端定義為 optional
  phaseDurationDays?: number; // 後端定義為 optional
};

// AI 生成折扣碼的回傳結果類型
export type AiCouponGenerateResponse = {
  strategySummary: string; // 後端會回傳策略摘要
  coupons: {
    couponName: string;
    type: "fixed" | "percentage";
    code: string;
    value: number;
    startsAt: string;
    expiresAt: string;
  }[];
};

// 批量創建折扣碼的輸入參數類型
export type BatchCreateCouponsRequest = {
  coupons: {
    couponName: string;
    type: "fixed" | "percentage";
    code: string;
    value: number;
    startsAt: string;
    expiresAt: string;
  }[];
};

// 批量創建折扣碼的回傳結果類型
export type BatchCreateCouponsResponse = {
  couponList: {
    couponName: string;
    type: "fixed" | "percentage";
    code: string;
    value: number;
    startsAt: string;
    expiresAt: string;
  }[];
};
