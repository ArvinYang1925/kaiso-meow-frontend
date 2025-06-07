import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { toast } from "@/hooks/use-toast";
import {
  getCourseCoverUrl,
  DEFAULT_COURSE_COVER,
} from "@/components/utils/courseImageUtils";
import {
  createCourse,
  getCourseDetail,
  updateCourse,
  getCourses,
  toggleCoursePublishStatus,
  deleteCourse,
  uploadCourseCoverAlt,
} from "./courseManagement.service";
import {
  Course,
  CreateCourseModel,
  UpdateCourseModel,
  CourseListItemModel,
  CourseFilterModel,
  PaginationParamsModel,
  PaginationInfoModel,
  CreateCourseResponse,
} from "./courseManagement.model";

// 排序選項類型
type CourseSortOption =
  | "created_desc"
  | "created_asc"
  | "student_count_desc"
  | "student_count_asc"
  | "title_asc"
  | "title_desc";

// 預設排序設定
const DEFAULT_SORT: CourseSortOption = "created_desc";

interface CourseState {
  // 課程列表相關
  allCourses: CourseListItemModel[]; // 所有課程資料
  courses: CourseListItemModel[]; // 當前頁面顯示的課程
  pagination: PaginationInfoModel;
  filter: CourseFilterModel;

  // 排序相關
  sortBy: CourseSortOption;

  // 當前課程相關
  currentCourse: Course | null;

  // UI 狀態
  isLoading: boolean;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  isUploading: boolean;

  // 內部狀態
  hasLoadedAll: boolean; // 是否已載入所有資料

  // 表單相關
  selectedFile: File | null;
  coverPreview: string;
}

interface CourseActions {
  fetchCourses: (params?: PaginationParamsModel) => Promise<void>;
  setFilter: (filter: Partial<CourseFilterModel>) => void;
  resetFilter: () => void;

  setSortBy: (sortBy: CourseSortOption) => void;
  resetSort: () => void;

  // 課程 CRUD 操作
  createNewCourse: (data: CreateCourseModel) => Promise<CreateCourseResponse>;
  fetchCourseDetail: (courseId: string) => Promise<void>;
  updateCourseDetail: (
    courseId: string,
    data: UpdateCourseModel
  ) => Promise<boolean>;
  removeCourse: (courseId: string) => Promise<boolean>;

  // 課程狀態操作
  togglePublishCourse: (
    courseId: string,
    isPublished: boolean
  ) => Promise<boolean>;

  // 檔案上傳操作
  uploadCourseImage: (file: File) => Promise<string | null>;

  // UI 狀態管理
  setIsLoading: (loading: boolean) => void;
  setCoverPreview: (url: string) => void;
  setSelectedFile: (file: File | null) => void;

  // 資料重置
  resetCurrentCourse: () => void;
  resetForm: () => void;
}

const initialPagination: PaginationInfoModel = {
  currentPage: 1,
  pageSize: 9,
  totalPages: 0,
  totalItems: 0,
};

const initialFilter: CourseFilterModel = {
  isPublished: undefined,
  isFree: undefined,
  search: undefined,
};

/**
 * 統一的成功訊息處理
 */
const handleSuccessMessage = (title: string, description: string) => {
  console.log("Showing success toast:", { title, description });
  toast({
    title,
    description,
  });
};

/**
 * 統一的錯誤訊息處理
 */
const handleErrorMessage = (title: string, message?: string) => {
  const finalMessage = message || "操作失敗，請稍後再試。";
  console.log("Showing error toast:", { title, description: finalMessage });
  toast({
    variant: "destructive",
    title,
    description: finalMessage,
  });
};

/**
 * 固定的課程排序函數
 * 1. 發布狀態（已上架 → 已下架）
 * 2. 建立時間（新 → 舊）
 */
const sortCoursesFixed = (
  courses: CourseListItemModel[]
): CourseListItemModel[] => {
  return [...courses].sort((a, b) => {
    // 第一優先級：已上架課程排在前面，已下架課程排在後面
    if (a.isPublished !== b.isPublished) {
      return b.isPublished ? 1 : -1;
    }

    // 第二優先級：建立時間（最新的在前）
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
};

/**
 * 前端分頁函數
 */
const paginateCourses = (
  courses: CourseListItemModel[],
  currentPage: number,
  pageSize: number = 9
): {
  paginatedCourses: CourseListItemModel[];
  pagination: PaginationInfoModel;
} => {
  const totalItems = courses.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const validCurrentPage = Math.max(1, Math.min(currentPage, totalPages));
  const startIndex = (validCurrentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  return {
    paginatedCourses: courses.slice(startIndex, endIndex),
    pagination: {
      currentPage: validCurrentPage,
      pageSize,
      totalPages,
      totalItems,
    },
  };
};

/**
 * 載入所有課程資料的輔助函數
 */
const loadAllCourses = async (): Promise<CourseListItemModel[]> => {
  try {
    let allCourses: CourseListItemModel[] = [];
    let currentPage = 1;
    let hasMore = true;

    while (hasMore) {
      const response = await getCourses({ page: currentPage, pageSize: 50 }); // 每次載入50筆

      if (response.status === "success" && response.data) {
        allCourses = [...allCourses, ...response.data.courseList];

        // 檢查是否還有更多資料
        hasMore = currentPage < response.data.pagination.totalPages;
        currentPage++;
      } else {
        hasMore = false;
      }
    }

    return allCourses;
  } catch (error) {
    throw new Error(
      `無法載入課程資料: ${error instanceof Error ? error.message : "未知錯誤"}`
    );
  }
};

export const useCourseStore = create<CourseState & CourseActions>()(
  immer<CourseState & CourseActions>((set, get) => ({
    // 初始狀態
    allCourses: [] as CourseListItemModel[],
    courses: [] as CourseListItemModel[],
    pagination: initialPagination,
    filter: initialFilter,
    sortBy: DEFAULT_SORT as CourseSortOption,
    currentCourse: null,
    isLoading: false,
    isCreating: false,
    isUpdating: false,
    isDeleting: false,
    isUploading: false,
    hasLoadedAll: false,
    selectedFile: null,
    coverPreview: DEFAULT_COURSE_COVER,

    // 獲取課程列表（實現固定排序和前端分頁）
    fetchCourses: async (params = { page: 1, pageSize: 9 }) => {
      try {
        set((state) => {
          state.isLoading = true;
        });

        const { hasLoadedAll, allCourses } = get();

        // 如果尚未載入所有資料，則先載入
        if (!hasLoadedAll || allCourses.length === 0) {
          const loadedCourses = await loadAllCourses();

          set((state) => {
            state.allCourses = loadedCourses;
            state.hasLoadedAll = true;
          });
        }

        // 取得所有課程資料後進行排序和分頁
        const { allCourses: currentAllCourses } = get();

        // 步驟1：固定排序（發布狀態 → 學生人數 → 建立時間）
        const sortedCourses = sortCoursesFixed(currentAllCourses);

        // 步驟2：前端分頁
        const { paginatedCourses, pagination: newPagination } = paginateCourses(
          sortedCourses,
          params.page,
          params.pageSize
        );

        set((state) => {
          state.courses = paginatedCourses;
          state.pagination = newPagination;
        });
      } catch {
        handleErrorMessage("載入失敗", "無法取得課程列表，請稍後再試。");
      } finally {
        set((state) => {
          state.isLoading = false;
        });
      }
    },

    // 設定篩選條件
    setFilter: (newFilter) => {
      set((state) => {
        Object.assign(state.filter, newFilter);
      });

      // 重新分頁（回到第一頁）
      get().fetchCourses({ page: 1, pageSize: 9 });
    },

    // 重置篩選條件
    resetFilter: () => {
      set((state) => {
        state.filter = { ...initialFilter };
      });

      // 重新分頁
      get().fetchCourses({ page: 1, pageSize: 9 });
    },

    // 設定排序方式（保留介面，但內部使用固定排序）
    setSortBy: (sortBy) => {
      set((state) => {
        state.sortBy = sortBy;
      });

      // 重新分頁（使用固定排序邏輯）
      get().fetchCourses({ page: 1, pageSize: 9 });
    },

    // 重置排序設定
    resetSort: () => {
      set((state) => {
        state.sortBy = DEFAULT_SORT;
      });

      // 重新分頁
      get().fetchCourses({ page: 1, pageSize: 9 });
    },

    // 創建新課程
    createNewCourse: async (data) => {
      try {
        set((state) => {
          state.isCreating = true;
        });

        const response = await createCourse(data);

        if (response.status === "success") {
          handleSuccessMessage("建立成功", "課程已成功建立。");

          // 清空快取，重新載入所有資料
          set((state) => {
            state.allCourses = [];
            state.hasLoadedAll = false;
          });

          await get().fetchCourses({ page: 1, pageSize: 9 });

          return response;
        } else {
          handleErrorMessage("建立失敗", response.message);
          return response;
        }
      } catch {
        const errorMessage = "無法建立課程，請稍後再試。";
        handleErrorMessage("建立失敗", errorMessage);

        return {
          status: "error" as const,
          message: errorMessage,
          data: undefined,
        };
      } finally {
        set((state) => {
          state.isCreating = false;
        });
      }
    },

    // 獲取課程詳細資訊
    fetchCourseDetail: async (courseId) => {
      try {
        set((state) => {
          state.isLoading = true;
        });

        const response = await getCourseDetail(courseId);

        if (response.status === "success" && response.data) {
          set((state) => {
            state.currentCourse = response.data! || null;
            state.coverPreview = getCourseCoverUrl(response.data!.coverUrl);
          });
        } else {
          handleErrorMessage("載入失敗", response.message);
        }
      } catch {
        handleErrorMessage("載入失敗", "無法取得課程資訊，請稍後再試。");
      } finally {
        set((state) => {
          state.isLoading = false;
        });
      }
    },

    // 更新課程
    updateCourseDetail: async (courseId, data) => {
      try {
        set((state) => {
          state.isUpdating = true;
        });

        const response = await updateCourse(courseId, data);

        if (response.status === "success") {
          set((state) => {
            state.currentCourse = response.data!;
          });

          handleSuccessMessage("更新成功", "課程資料已更新。");

          // 清空快取，重新載入所有資料
          set((state) => {
            state.allCourses = [];
            state.hasLoadedAll = false;
          });

          const { pagination } = get();
          await get().fetchCourses({
            page: pagination.currentPage,
            pageSize: 9,
          });

          return true;
        } else {
          handleErrorMessage("更新失敗", response.message);
          return false;
        }
      } catch {
        handleErrorMessage("更新失敗", "無法更新課程，請稍後再試。");
        return false;
      } finally {
        set((state) => {
          state.isUpdating = false;
        });
      }
    },

    // 刪除課程 - 最終修正版本，強化錯誤處理
    removeCourse: async (courseId) => {
      try {
        console.log("Store: Starting to remove course with ID:", courseId);

        set((state) => {
          state.isDeleting = true;
        });

        const response = await deleteCourse(courseId);

        console.log("Store: Delete course response:", response);
        console.log("Store: Response status:", response.status);
        console.log("Store: Response message:", response.message);

        if (response.status === "success") {
          console.log("Store: Course deletion successful");

          handleSuccessMessage("刪除成功", "課程已成功刪除。");

          // 清空快取，重新載入所有資料
          set((state) => {
            state.allCourses = [];
            state.hasLoadedAll = false;
            // 清空當前課程資料
            state.currentCourse = null;
          });

          const { pagination } = get();
          await get().fetchCourses({
            page: pagination.currentPage,
            pageSize: 9,
          });

          console.log("Store: Course list refreshed after deletion");
          return true;
        } else {
          // 錯誤處理 - 確保錯誤訊息正確顯示
          console.error("Store: Course deletion failed:", response.message);
          console.log(
            "Store: Calling handleErrorMessage with:",
            "刪除失敗",
            response.message
          );

          // 立即顯示錯誤訊息
          handleErrorMessage("刪除失敗", response.message);

          // 確保錯誤訊息有被處理
          if (response.message) {
            console.log("Store: Error message exists:", response.message);
          } else {
            console.log("Store: No error message in response");
            handleErrorMessage("刪除失敗", "刪除課程時發生錯誤，請稍後再試。");
          }

          return false;
        }
      } catch (error: unknown) {
        console.error("Store: Course deletion error:", error);

        // 更詳細的錯誤處理
        let errorMessage = "無法刪除課程，請稍後再試。";

        if (error instanceof Error) {
          errorMessage = error.message;
          console.error("Store: Error details:", {
            name: error.name,
            message: error.message,
            stack: error.stack,
          });
        }

        console.log(
          "Store: Calling handleErrorMessage for exception:",
          errorMessage
        );
        handleErrorMessage("刪除失敗", errorMessage);
        return false;
      } finally {
        console.log("Store: Cleaning up delete operation");
        set((state) => {
          state.isDeleting = false;
        });
      }
    },

    // 切換課程發布狀態
    togglePublishCourse: async (courseId, isPublished) => {
      try {
        const response = await toggleCoursePublishStatus(courseId, {
          isPublished,
        });

        if (response.status === "success") {
          const { pagination } = get();

          set((state) => {
            // 更新 allCourses 中的狀態
            const allCourseIndex = state.allCourses.findIndex(
              (course) => course.id === courseId
            );
            if (allCourseIndex !== -1) {
              state.allCourses[allCourseIndex].isPublished = isPublished;
            }

            // 更新當前課程狀態
            if (state.currentCourse && state.currentCourse.id === courseId) {
              state.currentCourse.isPublished = isPublished;
            }
          });

          // 重新應用排序和分頁
          const { allCourses } = get();
          const sortedCourses = sortCoursesFixed(allCourses);
          const { paginatedCourses, pagination: newPagination } =
            paginateCourses(sortedCourses, pagination.currentPage, 9);

          set((state) => {
            state.courses = paginatedCourses;
            state.pagination = newPagination;
          });

          handleSuccessMessage(
            `${isPublished ? "上架" : "下架"}成功`,
            `課程已成功${isPublished ? "上架" : "下架"}。`
          );

          return true;
        } else {
          handleErrorMessage(
            `${isPublished ? "上架" : "下架"}失敗`,
            response.message
          );
          return false;
        }
      } catch {
        handleErrorMessage(
          `${isPublished ? "上架" : "下架"}失敗`,
          `無法${isPublished ? "上架" : "下架"}課程，請稍後再試。`
        );
        return false;
      }
    },

    // 圖片上傳邏輯
    uploadCourseImage: async (file) => {
      try {
        set((state) => {
          state.isUploading = true;
        });

        // 檔案大小檢查
        if (file.size > 2 * 1024 * 1024) {
          throw new Error("檔案大小超過 2MB 限制");
        }

        // 檔案類型檢查
        const allowedTypes = [
          "image/jpeg",
          "image/jpg",
          "image/png",
          "image/gif",
        ];
        if (!allowedTypes.includes(file.type)) {
          throw new Error(`不支援的檔案類型: ${file.type}`);
        }

        // 確保檔案名稱有效
        const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");

        // 創建新的 File 物件以確保正確的名稱
        const processedFile = new File([file], sanitizedFileName, {
          type: file.type,
          lastModified: file.lastModified,
        });

        // 調用上傳服務
        const response = await uploadCourseCoverAlt(processedFile);

        if (response.status === "success" && response.data?.coverUrl) {
          const coverUrl = response.data.coverUrl;

          set((state) => {
            state.coverPreview = coverUrl;
          });

          return coverUrl;
        } else {
          const errorMessage = response.message || "上傳服務返回失敗狀態";
          throw new Error(errorMessage);
        }
      } finally {
        set((state) => {
          state.isUploading = false;
        });
      }
    },

    setIsLoading: (loading) => {
      set((state) => {
        state.isLoading = loading;
      });
    },

    setCoverPreview: (url) => {
      set((state) => {
        if (state.coverPreview !== url) {
          state.coverPreview = url;
        }
      });
    },

    setSelectedFile: (file) => {
      set((state) => {
        state.selectedFile = file;
      });
    },

    // 重置當前課程
    resetCurrentCourse: () => {
      set((state) => {
        state.currentCourse = null;
        state.coverPreview = DEFAULT_COURSE_COVER;
        state.selectedFile = null;
      });
    },

    // 重置表單函數
    resetForm: () => {
      set((state) => {
        const { currentCourse } = get();
        state.coverPreview = currentCourse
          ? getCourseCoverUrl(currentCourse.coverUrl)
          : DEFAULT_COURSE_COVER;
        state.selectedFile = null;
      });
    },
  }))
);
