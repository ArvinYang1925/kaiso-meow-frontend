import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { Order } from "./types";
import { Pagination } from "@/services/types";
import { fetchOrderList } from "./order-list.service";
import { DEFAULT_PAGINATION } from "@/lib/constants";

interface OrderListPageState {
  orderList: Order[];
  pagination: Pagination;
  isLoading: boolean;
  isShowDialog: boolean;
}

interface OrderListPageAction {
  fetchOrder: (page: number, pageSize: number) => void;
  setIsShowDialog: (isShowDialog: boolean) => void;
  resetStore: () => void;
}

export const useOrderListStore = create<OrderListPageState & OrderListPageAction>()(
  immer((set) => ({
    orderList: [],
    pagination: DEFAULT_PAGINATION,
    isLoading: false,
    isShowDialog: false,
    fetchOrder: async (page, pageSize) => {
      set((state) => {
        state.isLoading = true;
      });
      try {
        const response = await fetchOrderList(page, pageSize);
        set((state) => {
          state.orderList = response.orderList;
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
        state.orderList = [];
        state.pagination = DEFAULT_PAGINATION;
        state.isLoading = false;
        state.isShowDialog = false;
      });
    },
  }))
);
