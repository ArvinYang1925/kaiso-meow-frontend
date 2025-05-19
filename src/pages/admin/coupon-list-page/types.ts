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
  value: string;
  // startsAt: string;
  expiresAt: string;
};
