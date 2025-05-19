import axios from "@/services/axiosInstance"; //很重要，這邊必須確認呼叫到的是 axiosInstance!!
import { Coupon } from "./types";
import { Pagination } from "@/services/types";

export type CouponListResponse = {
  couponList: Coupon[];
  pagination: Pagination;
};

export const fetchCouponList = async (
  page: number,
  pageSize: number
): Promise<CouponListResponse> => {
  const response = await axios.get("/api/v1/instructor/coupons", {
    params: { page, pageSize },
  });
  return response.data.data;
};
