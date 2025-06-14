import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { Coupon, CreateCouponModel } from "./types";
import { BaseApiResponseModel, Pagination } from "@/services/types";
import {
  fetchCouponList,
  createCouponList,
  deleteCouponList,
} from "./coupon-list.service";
import { DEFAULT_PAGINATION } from "@/lib/constants";

interface CouponListPageState {
  couponList: Coupon[];
  pagination: Pagination;
  isLoading: boolean;
  isShowDialog: boolean;
}

interface CouponListPageAction {
  fetchCouponList: (page: number, pageSize: number) => Promise<void>;
  createCouponList: (
    createParams: CreateCouponModel
  ) => Promise<BaseApiResponseModel>;
  deleteCouponList: (id: string) => Promise<BaseApiResponseModel>;
  setIsShowDialog: (isShowDialog: boolean) => void;
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
        // console.error("Failed to fetch data", error);
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
        // console.error("Failed to fetch data", error);
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
        // console.error("Failed to fetch data", error);
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
    resetStore: () => {
      set((state) => {
        state.couponList = [];
        state.pagination = DEFAULT_PAGINATION;
        state.isLoading = false;
        state.isShowDialog = false;
      });
    },
  }))
);
