export type Coupon = {
  id: string;
  couponName: string;
  type: string;
  code: string;
  value: number;
  expiresAt: string;
};

export type CreateCouponModel = {
  couponName: string;
  type: string;
  code: string;
  value: number;
  startsAt: string;
  expiresAt: string;
};
