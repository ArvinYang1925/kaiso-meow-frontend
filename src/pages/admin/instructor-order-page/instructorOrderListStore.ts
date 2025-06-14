import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { InstructorOrder } from "./types";
import { Pagination } from "@/services/types";
import { fetchInstructorOrderList } from "./instructor-order.service";
import { DEFAULT_PAGINATION } from "@/lib/constants";

interface InstructorOrderListPageState {
  orderList: InstructorOrder[];
  pagination: Pagination;
  isLoading: boolean;
  isShowDialog: boolean;
}

interface InstructorOrderListPageAction {
  fetchOrderList: (page: number, pageSize: number) => Promise<void>;
  setIsShowDialog: (isShowDialog: boolean) => void;
  resetStore: () => void;
}

export const useInstructorOrderListStore = create<
  InstructorOrderListPageState & InstructorOrderListPageAction
>()(
  immer((set) => ({
    orderList: [],
    pagination: DEFAULT_PAGINATION,
    isLoading: false,
    isShowDialog: false,
    fetchOrderList: async (page, pageSize) => {
      set((state) => {
        state.isLoading = true;
      });
      try {
        const response = await fetchInstructorOrderList(page, pageSize);
        set((state) => {
          state.orderList = response.orderList;
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
    setIsShowDialog: (isShowDialog) => {
      set((state) => {
        state.isShowDialog = isShowDialog;
      });
    },
    resetStore: () => {
      set((state) => {
        state.orderList = [];
        state.pagination = DEFAULT_PAGINATION;
        state.isLoading = false;
        state.isShowDialog = false;
      });
    },
  }))
);
