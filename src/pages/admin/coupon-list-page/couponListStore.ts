import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import {
  Coupon,
  CreateCouponModel,
  AiCouponGenerateRequest,
  AiCouponGenerateResponse,
  BatchCreateCouponsRequest,
  BatchCreateCouponsResponse,
} from "./types";
import { BaseApiResponseModel, Pagination } from "@/services/types";
import { ApiResponseModel } from "../models/api.model";
import {
  fetchCouponList,
  createCouponList,
  deleteCouponList,
  generateAICoupons,
  createBatchCoupons,
} from "./coupon-list.service";
import { DEFAULT_PAGINATION } from "@/lib/constants";

interface CouponListPageState {
  couponList: Coupon[];
  pagination: Pagination;
  isLoading: boolean;
  isShowDialog: boolean;
  // AI 生成折扣碼相關狀態
  aiGeneratedCoupons: AiCouponGenerateResponse | null;
  isAiGenerating: boolean;
  // 儲存AI生成時選擇的折扣類型
  selectedDiscountType: "percentage" | "fixed" | null;
  // 儲存原始的課程描述
  originalCourseDescription: string | null;
  // 可編輯的折扣碼草稿列表
  editableCouponDrafts: {
    couponName: string;
    type: string;
    code: string;
    value: number;
    startsAt: string;
    expiresAt: string;
  }[];
  // 批量操作相關狀態
  isBatchCreating: boolean;
}

interface CouponListPageAction {
  fetchCouponList: (page: number, pageSize: number) => Promise<void>;
  createCouponList: (
    createParams: CreateCouponModel
  ) => Promise<ApiResponseModel<Coupon>>;
  deleteCouponList: (id: string) => Promise<BaseApiResponseModel>;
  setIsShowDialog: (isShowDialog: boolean) => void;
  // AI 生成折扣碼相關 actions
  generateAICoupons: (
    params: AiCouponGenerateRequest
  ) => Promise<AiCouponGenerateResponse | undefined>;
  clearAiGeneratedCoupons: () => void;
  // 管理可編輯折扣碼草稿的 actions
  setEditableCouponDrafts: (
    coupons: {
      couponName: string;
      type: string;
      code: string;
      value: number;
      startsAt: string;
      expiresAt: string;
    }[]
  ) => void;
  updateEditableCouponDraft: (
    index: number,
    field: string,
    value: string | number
  ) => void;
  addNewCouponDraft: () => void;
  removeEditableCouponDraft: (index: number) => void;
  clearEditableCouponDrafts: () => void;
  // 批量新增折扣碼 action
  createBatchCoupons: (
    params: BatchCreateCouponsRequest
  ) => Promise<BatchCreateCouponsResponse | undefined>;

  resetStore: () => void;
}

export const useCouponListStore = create<
  CouponListPageState & CouponListPageAction
>()(
  immer((set) => ({
    couponList: [],
    pagination: DEFAULT_PAGINATION,
    isLoading: false,
    isShowDialog: false,
    // AI 生成折扣碼相關狀態初始值
    aiGeneratedCoupons: null,
    isAiGenerating: false,
    // 儲存AI生成時選擇的折扣類型初始值
    selectedDiscountType: null,
    // 儲存原始的課程描述初始值
    originalCourseDescription: null,
    // 可編輯的折扣碼草稿列表初始值
    editableCouponDrafts: [],
    // 批量操作相關狀態初始值
    isBatchCreating: false,
    fetchCouponList: async (page, pageSize) => {
      set((state) => {
        state.isLoading = true;
      });
      try {
        const response = await fetchCouponList(page, pageSize);
        set((state) => {
          state.couponList = response.couponList;
          state.pagination = response.pagination;
        });
      } catch {
        // 忽略錯誤
      } finally {
        set((state) => {
          state.isLoading = false;
        });
      }
    },
    createCouponList: async (createParams) => {
      set((state) => {
        state.isLoading = true;
      });
      try {
        const response = await createCouponList(createParams);
        return response;
      } catch {
        return {
          status: "error",
          message: "新增折扣碼失敗",
        };
      } finally {
        set((state) => {
          state.isLoading = false;
        });
      }
    },
    deleteCouponList: async (id) => {
      set((state) => {
        state.isLoading = true;
      });
      try {
        const response = await deleteCouponList(id);
        return response;
      } catch {
        // 忽略錯誤
      } finally {
        set((state) => {
          state.isLoading = false;
        });
      }
    },
    setIsShowDialog: (isShowDialog) => {
      set((state) => {
        state.isShowDialog = isShowDialog;
      });
    },
    // AI 生成折扣碼
    generateAICoupons: async (params) => {
      set((state) => {
        state.isAiGenerating = true;
      });
      try {
        const response = await generateAICoupons(params);
        set((state) => {
          state.aiGeneratedCoupons = response;
          state.selectedDiscountType = params.discountType as
            | "percentage"
            | "fixed";
          state.originalCourseDescription = params.courseDescription;
        });
        return response;
      } finally {
        set((state) => {
          state.isAiGenerating = false;
        });
      }
    },
    // 清除 AI 生成的折扣碼
    clearAiGeneratedCoupons: () => {
      set((state) => {
        state.aiGeneratedCoupons = null;
        state.selectedDiscountType = null;
        state.originalCourseDescription = null;
      });
    },
    // 設定可編輯的折扣碼草稿
    setEditableCouponDrafts: (coupons) => {
      set((state) => {
        state.editableCouponDrafts = coupons;
      });
    },
    // 更新特定折扣碼草稿的欄位
    updateEditableCouponDraft: (index, field, value) => {
      set((state) => {
        if (state.editableCouponDrafts[index]) {
          if (field === "value") {
            state.editableCouponDrafts[index][field] = value as number;
          } else {
            (
              state.editableCouponDrafts[index] as Record<
                string,
                string | number
              >
            )[field] = value;
          }
        }
      });
    },
    // 新增空白折扣碼草稿
    addNewCouponDraft: () => {
      set((state) => {
        state.editableCouponDrafts.push({
          couponName: "",
          type: "fixed",
          code: "",
          value: 0,
          startsAt: "",
          expiresAt: "",
        });
      });
    },
    // 移除特定折扣碼草稿
    removeEditableCouponDraft: (index) => {
      set((state) => {
        state.editableCouponDrafts.splice(index, 1);
      });
    },
    // 清除所有可編輯的折扣碼草稿
    clearEditableCouponDrafts: () => {
      set((state) => {
        state.editableCouponDrafts = [];
      });
    },
    // 批量新增折扣碼
    createBatchCoupons: async (params) => {
      set((state) => {
        state.isBatchCreating = true;
      });
      try {
        const response = await createBatchCoupons(params);
        return response;
      } finally {
        set((state) => {
          state.isBatchCreating = false;
        });
      }
    },

    resetStore: () => {
      set((state) => {
        state.couponList = [];
        state.pagination = DEFAULT_PAGINATION;
        state.isLoading = false;
        state.isShowDialog = false;
        state.aiGeneratedCoupons = null;
        state.isAiGenerating = false;
        state.selectedDiscountType = null;
        state.originalCourseDescription = null;
        state.editableCouponDrafts = [];
        state.isBatchCreating = false;
      });
    },
  }))
);
