/** 訂單狀態類型 */
export type OrderStatus = null | "pending" | "paid" | "failed";

/** 課程資訊 */
export type CourseInfo = {
  title: string;
  cover_url: string;
  id: string;
  // price: number;
};
/** 學生資訊 */
export type UserInfo = {
  id: string;
  name: string;
  phoneNumber: string;
  email: string;
};

/** 折扣碼資訊 */
export type CouponInfo = {
  id: string;
  value: string;
  code: string;
  type: string;
  couponName: string;
};

/** 訂單資訊 */
type OrderInfo = {
  /** 課程卡片的原價 */
  originalPrice: number;
  /** 訂單總計價格 */
  orderPrice: number;
};

/** 訂單預覽 - 回傳資料 */
export type OrderPreviewResponseModel = {
  /** 課程卡片的原價 */
  originalPrice: number | null;
  /** 訂單總計價格 */
  orderPrice: number | null;
  /** 訂單狀態 */
  status: OrderStatus;
  /** 課程資訊 */
  course: CourseInfo;
  /** 學生資訊 */
  user: UserInfo;
};

/** 使用折扣碼 - 回傳資料 */
export type ApplyCouponResponseModel = {
  coupon: CouponInfo;
  order: OrderInfo;
};

/** 取得訂單 - 回傳資料 */
export type FetchOrderResponseModel = {
  id: string;
  /** 課程卡片的原價 */
  originalPrice: number | null;
  /** 訂單總計價格 */
  orderPrice: number | null;
  /** 訂單狀態 */
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
  paidAt: string;
  course: CourseInfo;
  coupon: CouponInfo;
  user: UserInfo;
};

/** 創建訂單 - 回傳資料 */
export type CreateOrderResponseModel = {
  id: string;
  /** 課程卡片的原價 */
  originalPrice: number | null;
  /** 訂單總計價格 */
  orderPrice: number | null;
  /** 訂單狀態 */
  status: OrderStatus;
  createdAt: string;
  course: CourseInfo;
  coupon: CouponInfo;
  user: UserInfo;
};

/** 訂單預覽 - 請求資料  */
export type OrderPreviewRequestModel = {
  courseId: string;
};

/** 驗證折扣碼 - 請求資料 */
export type ApplyCouponRequestModel = {
  couponCode: string;
  originalPrice: number;
};

/** 建立訂單 - 請求資料 */
export type CreateOrderRequestModel = {
  courseId: string;
  couponId: string;
};
