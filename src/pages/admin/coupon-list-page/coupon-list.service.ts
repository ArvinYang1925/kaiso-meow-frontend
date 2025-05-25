import axios from "@/services/axiosInstance"; //很重要，這邊必須確認呼叫到的是 axiosInstance!!
import { Coupon, CreateCouponModel } from "./types";
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

export const createCouponList = async (createParams: CreateCouponModel) => {
  const response = await axios.post("/api/v1/instructor/coupons", createParams);
  return response.data;
};

export const deleteCouponList = async (id: string) => {
  const response = await axios.delete(`/api/v1/instructor/coupons/${id}`);
  return response.data;
};
