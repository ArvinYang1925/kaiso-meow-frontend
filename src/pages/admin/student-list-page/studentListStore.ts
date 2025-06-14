import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { Student } from "./types";
import { Pagination } from "@/services/types";
import { fetchStudentList } from "./student-list.service";
import { DEFAULT_PAGINATION } from "@/lib/constants";

interface StudentListPageState {
  studentList: Student[];
  pagination: Pagination;
  isLoading: boolean;
  isShowDialog: boolean;
}

interface StudentListPageAction {
  fetchStudentList: (page: number, pageSize: number) => Promise<void>;
  setIsShowDialog: (isShowDialog: boolean) => void;
  resetStore: () => void;
}

export const useStudentListStore = create<
  StudentListPageState & StudentListPageAction
>()(
  immer((set) => ({
    studentList: [],
    pagination: DEFAULT_PAGINATION,
    isLoading: false,
    isShowDialog: false,
    fetchStudentList: async (page, pageSize) => {
      set((state) => {
        state.isLoading = true;
      });
      try {
        const response = await fetchStudentList(page, pageSize);
        set((state) => {
          state.studentList = response.studentList;
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
        state.studentList = [];
        state.pagination = DEFAULT_PAGINATION;
        state.isLoading = false;
        state.isShowDialog = false;
      });
    },
  }))
);
