import axios from "@/services/axiosInstance";
import { AxiosError } from "axios";
import { ApiResponseModel } from "@/pages/admin/models/api.model";
import {
  Coupon,
  CreateCouponModel,
  AiCouponGenerateRequest,
  AiCouponGenerateResponse,
  BatchCreateCouponsRequest,
  BatchCreateCouponsResponse,
} from "./types";
import { Pagination } from "@/services/types";

export type CouponListResponse = {
  couponList: Coupon[];
  pagination: Pagination;
};

/**
 * 優化的錯誤處理 - 僅使用 API 回傳的錯誤訊息
 * @param error - 捕獲的錯誤
 * @returns 統一格式的錯誤回應
 */
const handleApiError = <T>(error: unknown): ApiResponseModel<T> => {
  if (error instanceof AxiosError) {
    const apiMessage =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.response?.data?.detail ||
      error.message;

    return {
      status: "error",
      message: apiMessage || "發生未知錯誤",
      data: undefined,
    };
  }

  return {
    status: "error",
    message: "發生未知錯誤",
    data: undefined,
  };
};

/** 取得折扣碼列表 API */
export const fetchCouponList = async (
  page: number,
  pageSize: number
): Promise<CouponListResponse> => {
  const response = await axios.get("/api/v1/instructor/coupons", {
    params: { page, pageSize },
  });
  return response.data.data;
};

/** 新增折扣碼 API */
export const createCouponList = async (
  createParams: CreateCouponModel
): Promise<ApiResponseModel<Coupon>> => {
  try {
    const response = await axios.post(
      "/api/v1/instructor/coupons",
      createParams
    );

    return {
      status: "success",
      message: response.data.message || "新增折扣碼成功",
      data: response.data.data,
    };
  } catch (error) {
    return handleApiError<Coupon>(error);
  }
};

/** 刪除折扣碼 API */
export const deleteCouponList = async (id: string) => {
  const response = await axios.delete(`/api/v1/instructor/coupons/${id}`);
  return response.data;
};

/** AI 生成折扣碼 API */
export const generateAICoupons = async (
  params: AiCouponGenerateRequest
): Promise<AiCouponGenerateResponse> => {
  try {
    const response = await axios.post(
      "/api/v1/instructor/coupons/ai-generate",
      params
    );
    return response.data.data;
  } catch (error) {
    const errorResponse = handleApiError<AiCouponGenerateResponse>(error);
    throw new Error(errorResponse.message);
  }
};

/** 批量新增折扣碼 API */
export const createBatchCoupons = async (
  params: BatchCreateCouponsRequest
): Promise<BatchCreateCouponsResponse> => {
  try {
    const response = await axios.post(
      "/api/v1/instructor/coupons/batch",
      params
    );
    return response.data.data;
  } catch (error) {
    const errorResponse = handleApiError<BatchCreateCouponsResponse>(error);
    throw new Error(errorResponse.message);
  }
};
