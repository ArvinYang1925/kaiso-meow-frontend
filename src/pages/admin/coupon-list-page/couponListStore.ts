import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { Coupon } from "./types";
import { Pagination } from "@/services/types";
import { fetchCouponList } from "./coupon-list.service";
import { DEFAULT_PAGINATION } from "@/lib/constants";

interface CouponListPageState {
  couponList: Coupon[];
  pagination: Pagination;
  isLoading: boolean;
  isShowDialog: boolean;
}

interface CouponListPageAction {
  fetchCouponList: (page: number, pageSize: number) => void;
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
      } catch (error) {
        console.error("Failed to fetch data", error);
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
