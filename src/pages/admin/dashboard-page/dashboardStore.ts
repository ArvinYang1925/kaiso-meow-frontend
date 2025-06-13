import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { toast } from "@/hooks/use-toast";
import {
  getInstructorRevenue,
  getInstructorCourses,
  validateDateRange,
  validateDashboardForm,
  formatDateForAPI,
  suggestOptimalInterval,
  isApiResponseSuccess,
  createCacheKey,
} from "./dashboard.service";
import {
  RevenueReportDataModel,
  RevenueFilterModel,
  IntervalType,
  RevenueQueryParamsModel,
  getDefaultDateRange,
  DEFAULT_INTERVAL,
  RevenueChartDataModel,
  ErrorStateModel,
  DataUpdateStateModel,
  StatisticsCalculationResult,
  CourseOptionModel,
} from "./dashboard.model";

// ============================
// Store 配置常數
// ============================
const CACHE_CONFIG = {
  TIMEOUT: 5 * 60 * 1000, // 5分鐘
  MAX_ENTRIES: 10, // 最大快取項目數
} as const;

const UI_CONFIG = {
  DEBOUNCE_DELAY: 300, // 防抖延遲 (毫秒)
  AUTO_REFRESH_INTERVAL: 30 * 60 * 1000, // 30分鐘自動更新
} as const;

/**
 * 原始課程資料型別 (來自 API)
 */
type RawCourseData = Record<string, unknown> & {
  id?: string | number;
  courseId?: string | number;
  _id?: string | number;
  uuid?: string | number;
  title?: string;
  name?: string;
  courseName?: string;
  displayName?: string;
  createdAt?: string;
  created_at?: string;
};

// ============================
// Store 狀態介面
// ============================
interface RevenueState {
  // 核心數據
  revenueData: RevenueReportDataModel | null;
  courseOptions: CourseOptionModel[];
  filter: RevenueFilterModel;
  chartData: RevenueChartDataModel | null;

  // UI 狀態
  isLoading: boolean;
  isLoadingCourseOptions: boolean;
  isRefreshing: boolean;
  selectedTab: "overview" | "chart" | "table";

  // 錯誤狀態
  error: ErrorStateModel;

  // 快取和更新狀態
  updateState: DataUpdateStateModel;
  cacheKeys: Record<string, number>; // key 是快取鍵，value 是時間戳

  // 其他狀態
  hasInitialized: boolean;
}

interface RevenueActions {
  // 初始化操作
  initialize: () => Promise<void>;
  reset: () => void;

  // 數據獲取
  fetchRevenueReport: (forceRefresh?: boolean) => Promise<void>;
  fetchCourseOptions: () => Promise<void>;
  refreshAllData: () => Promise<void>;

  // 篩選操作
  setFilter: (filter: Partial<RevenueFilterModel>) => void;
  resetFilter: () => void;
  setDateRange: (startDate: Date, endDate: Date) => void;
  setInterval: (interval: IntervalType) => void;
  setCourseFilter: (courseId?: string) => void;
  applyFiltersWithValidation: () => Promise<boolean>;

  // UI 狀態管理
  setSelectedTab: (tab: "overview" | "chart" | "table") => void;
  clearError: () => void;
  setError: (error: string, type?: ErrorStateModel["type"]) => void;

  // 工具函數
  validateCurrentFilter: () => { isValid: boolean; message?: string };
  getSuggestedInterval: () => IntervalType;
  getStatistics: () => StatisticsCalculationResult;

  // 數據計算 (優化版)
  getRevenueGrowth: () => number;
  getTopRevenueDay: () => { date: string; revenue: number } | null;
  getAverageDailyRevenue: () => number;
  getTotalOrdersGrowth: () => number;
  getAverageOrderValueGrowth: () => number;
}

// ============================
// 輔助函數
// ============================

/**
 * 顯示成功訊息
 */
const showSuccessToast = (title: string, description?: string): void => {
  toast({
    title,
    description,
    variant: "default",
  });
};

/**
 * 顯示錯誤訊息
 */
const showErrorToast = (title: string, description?: string): void => {
  toast({
    title,
    description,
    variant: "destructive",
  });
};

/**
 * 顯示警告訊息
 */
const showWarningToast = (title: string, description?: string): void => {
  toast({
    title,
    description,
    variant: "destructive",
  });
};

/**
 * Store 專用的防抖函數
 */
const storeDebounce = <T extends unknown[]>(
  func: (...args: T) => void,
  wait: number
): ((...args: T) => void) => {
  let timeout: NodeJS.Timeout;

  return (...args: T) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

/**
 * 檢查快取是否有效 - 使用普通對象
 */
const isCacheValid = (
  cacheKeys: Record<string, number>,
  key: string,
  timeout: number = CACHE_CONFIG.TIMEOUT
): boolean => {
  const timestamp = cacheKeys[key];
  if (!timestamp) return false;
  return Date.now() - timestamp < timeout;
};

/**
 * 清理過期的快取項目 - 使用普通對象
 */
const cleanExpiredCache = (
  cacheKeys: Record<string, number>
): Record<string, number> => {
  const now = Date.now();
  const newCache: Record<string, number> = {};

  for (const [key, timestamp] of Object.entries(cacheKeys)) {
    if (now - timestamp < CACHE_CONFIG.TIMEOUT) {
      newCache[key] = timestamp;
    }
  }

  return newCache;
};

/**
 * 檢查是否為有效的課程資料
 */
const isValidRawCourse = (course: unknown): course is RawCourseData => {
  if (!course || typeof course !== "object") {
    return false;
  }

  const c = course as Record<string, unknown>;
  return !!(c.id || c.courseId || c._id || c.uuid);
};

/**
 * 從原始課程資料中提取 ID
 */
const extractCourseIdFromRaw = (course: RawCourseData): string => {
  return String(
    course.id || course.courseId || course._id || course.uuid || ""
  );
};

/**
 * 從原始課程資料中提取標題
 */
const extractCourseTitleFromRaw = (
  course: RawCourseData,
  fallbackId: string
): string => {
  const title =
    course.title || course.name || course.courseName || course.displayName;
  return String(title || `課程 ${fallbackId}`);
};

/**
 * 從原始課程資料中提取建立日期
 */
const extractCourseDateFromRaw = (course: RawCourseData): string => {
  const createdAt =
    course.createdAt || course.created_at || new Date().toISOString();
  return String(createdAt);
};

/**
 * 轉換收益數據為圖表格式
 */
const transformToChartData = (
  revenueData: RevenueReportDataModel
): RevenueChartDataModel => {
  try {
    const items = revenueData?.revenueData ?? [];

    if (items.length === 0) {
      return {
        labels: [],
        datasets: [
          { label: "收益", data: [] },
          { label: "訂單數量", data: [] },
        ],
      };
    }

    const chartLabels: string[] = [];
    const revenuePoints: number[] = [];
    const orderPoints: number[] = [];

    for (const item of items) {
      // 使用 intervalStart 作為標籤
      if (!item.intervalStart) {
        continue;
      }

      // 格式化日期標籤
      const date = new Date(item.intervalStart);
      const formattedLabel = new Intl.DateTimeFormat("zh-TW", {
        month: "2-digit",
        day: "2-digit",
      }).format(date);

      chartLabels.push(formattedLabel);

      // 確保數值為有效的數字
      const revenue =
        typeof item.totalRevenue === "number"
          ? item.totalRevenue
          : Number(item.totalRevenue) || 0;
      const orderCount =
        typeof item.orderCount === "number"
          ? item.orderCount
          : Number(item.orderCount) || 0;
      revenuePoints.push(revenue);
      orderPoints.push(orderCount);
    }

    return {
      labels: chartLabels,
      datasets: [
        {
          label: "收益",
          data: revenuePoints,
          borderColor: "hsl(198, 93%, 60%)",
          backgroundColor: "hsla(198, 93%, 60%, 0.1)",
          fill: true,
        },
        {
          label: "訂單數量",
          data: orderPoints,
          borderColor: "hsl(142, 76%, 45%)",
          backgroundColor: "hsla(142, 76%, 45%, 0.1)",
          fill: false,
        },
      ],
    };
  } catch {
    return {
      labels: [],
      datasets: [
        { label: "收益", data: [] },
        { label: "訂單數量", data: [] },
      ],
    };
  }
};

/**
 * 獲取初始篩選條件
 */
const getInitialFilter = (): RevenueFilterModel => {
  const { startDate, endDate } = getDefaultDateRange();
  return {
    startDate,
    endDate,
    interval: DEFAULT_INTERVAL,
    selectedCourseId: null,
  };
};

/**
 * 獲取初始錯誤狀態
 */
const getInitialErrorState = (): ErrorStateModel => ({
  hasError: false,
  message: "",
  type: "unknown",
});

/**
 * 獲取初始更新狀態
 */
const getInitialUpdateState = (): DataUpdateStateModel => ({
  lastUpdated: null,
  isAutoRefresh: false,
  refreshInterval: UI_CONFIG.AUTO_REFRESH_INTERVAL,
});

export const useRevenueStore = create<RevenueState & RevenueActions>()(
  immer<RevenueState & RevenueActions>((set, get) => ({
    // 🔧 初始狀態
    revenueData: null,
    courseOptions: [] as CourseOptionModel[],
    filter: getInitialFilter(),
    chartData: null,
    isLoading: false,
    isLoadingCourseOptions: false,
    isRefreshing: false,
    selectedTab: "overview",
    error: getInitialErrorState(),
    updateState: getInitialUpdateState(),
    cacheKeys: {},
    hasInitialized: false,

    // 初始化
    initialize: async () => {
      const { hasInitialized } = get();

      if (hasInitialized) {
        return;
      }

      set((state) => {
        state.isLoading = true;
        state.isLoadingCourseOptions = true;
        state.error = getInitialErrorState();
      });

      try {
        await Promise.all([
          get().fetchCourseOptions(),
          get().fetchRevenueReport(),
        ]);

        if (get().error.hasError) {
          throw new Error(get().error.message || "無法載入課程選項");
        }

        if (!get().revenueData) {
          throw new Error("無法載入收益數據");
        }

        set((state) => {
          state.hasInitialized = true;
          state.updateState.lastUpdated = new Date();
        });

        showSuccessToast("儀表板載入完成", "數據已成功載入");
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "初始化失敗";

        set((state) => {
          state.error = {
            hasError: true,
            message: errorMessage,
            type: "api",
          };
        });

        showErrorToast("載入失敗", "無法初始化儀表板，請重新整理頁面");
      } finally {
        set((state) => {
          state.isLoading = false;
          state.isLoadingCourseOptions = false;
        });
      }
    },

    // 重置狀態
    reset: () => {
      set((state) => {
        state.revenueData = null;
        state.courseOptions = [];
        state.filter = getInitialFilter();
        state.chartData = null;
        state.isLoading = false;
        state.isLoadingCourseOptions = false;
        state.isRefreshing = false;
        state.selectedTab = "overview";
        state.error = getInitialErrorState();
        state.updateState = getInitialUpdateState();
        state.cacheKeys = {};
        state.hasInitialized = false;
      });
    },

    // 獲取收益報表
    fetchRevenueReport: async (forceRefresh = false) => {
      const { filter, cacheKeys } = get();

      try {
        const queryParams: RevenueQueryParamsModel = {
          startTime: formatDateForAPI(filter.startDate),
          endTime: formatDateForAPI(filter.endDate),
          interval: filter.interval,
          courseId: filter.selectedCourseId || undefined,
        };

        const cacheKey = createCacheKey(queryParams);

        if (!forceRefresh && isCacheValid(cacheKeys, cacheKey)) {
          return;
        }

        set((state) => {
          state.isLoading = true;
          state.error = getInitialErrorState();
        });

        const response = await getInstructorRevenue(queryParams);

        if (!response) {
          throw new Error("收益 API 回應為空");
        }

        if (isApiResponseSuccess(response) && response.data) {
          if (
            !response.data.revenueData ||
            !Array.isArray(response.data.revenueData)
          ) {
            throw new Error("收益 API 回應數據格式錯誤");
          }

          const chartData = transformToChartData(response.data);

          set((state) => {
            state.revenueData = response.data;
            state.chartData = chartData;
            state.updateState.lastUpdated = new Date();
            state.error = getInitialErrorState();
            state.cacheKeys = cleanExpiredCache(state.cacheKeys);
            state.cacheKeys[cacheKey] = Date.now();
          });

          if (forceRefresh) {
            showSuccessToast("數據更新", "收益報表已更新至最新數據");
          }
        } else {
          throw new Error(response.message || "無法取得收益報表");
        }
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "無法取得收益報表，請稍後再試";

        set((state) => {
          state.error = {
            hasError: true,
            message: errorMessage,
            type: "api",
          };
          state.revenueData = null;
          state.chartData = null;
        });

        showErrorToast("載入失敗", errorMessage);
      } finally {
        set((state) => {
          state.isLoading = false;
        });
      }
    },

    // 獲取課程選項
    fetchCourseOptions: async () => {
      try {
        set((state) => {
          state.isLoadingCourseOptions = true;
          state.error = getInitialErrorState();
        });

        const response = await getInstructorCourses();

        if (response && response.status === "success") {
          if (response.data && response.data.courseList) {
            const rawCourses = response.data.courseList;

            if (Array.isArray(rawCourses)) {
              const validCourses = rawCourses
                .filter((course: unknown): course is RawCourseData => {
                  return isValidRawCourse(course);
                })
                .map((course: RawCourseData): CourseOptionModel => {
                  const courseId = extractCourseIdFromRaw(course);
                  const courseTitle = extractCourseTitleFromRaw(
                    course,
                    courseId
                  );
                  const courseDate = extractCourseDateFromRaw(course);

                  return {
                    id: courseId,
                    title: courseTitle,
                    createdAt: courseDate,
                  };
                })
                .sort((a, b) => {
                  return (
                    new Date(b.createdAt).getTime() -
                    new Date(a.createdAt).getTime()
                  );
                });

              set((state) => {
                state.courseOptions = validCourses;
                state.error = getInitialErrorState();
              });

              if (validCourses.length === 0) {
                showWarningToast("課程資料", "目前沒有可用的課程資料");
              }
            } else {
              throw new Error("課程資料格式錯誤 - courseList 不是陣列");
            }
          } else {
            throw new Error("API 回應缺少課程數據");
          }
        } else {
          throw new Error(response?.message || "無法取得課程選項");
        }
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "無法取得課程選項，請稍後再試";

        set((state) => {
          state.courseOptions = [];
          state.error = {
            hasError: true,
            message: errorMessage,
            type: "api",
          };
        });

        showErrorToast("載入失敗", `課程選項載入失敗: ${errorMessage}`);
      } finally {
        set((state) => {
          state.isLoadingCourseOptions = false;
        });
      }
    },

    // 刷新所有數據
    refreshAllData: async () => {
      set((state) => {
        state.isRefreshing = true;
      });

      try {
        await Promise.allSettled([
          get().fetchCourseOptions(),
          get().fetchRevenueReport(true),
        ]);

        showSuccessToast("數據刷新", "所有數據已更新至最新狀態");
      } catch {
        showErrorToast("刷新失敗", "無法刷新數據，請稍後再試");
      } finally {
        set((state) => {
          state.isRefreshing = false;
        });
      }
    },

    // 設定篩選條件 (防抖版)
    setFilter: storeDebounce((newFilter: Partial<RevenueFilterModel>) => {
      set((state) => {
        Object.assign(state.filter, newFilter);
      });

      // 自動重新獲取數據
      get().fetchRevenueReport();
    }, UI_CONFIG.DEBOUNCE_DELAY),

    // 重置篩選條件
    resetFilter: () => {
      set((state) => {
        state.filter = getInitialFilter();
      });

      get().fetchRevenueReport();
      showSuccessToast("篩選重置", "已重置為預設篩選條件");
    },

    // 設定日期範圍
    setDateRange: (startDate, endDate) => {
      const validation = validateDateRange(startDate, endDate);

      if (!validation.isValid) {
        get().setError(validation.error || "日期範圍無效", "validation");
        showErrorToast("日期範圍錯誤", validation.error);
        return;
      }

      set((state) => {
        state.filter.startDate = startDate;
        state.filter.endDate = endDate;
        state.error = getInitialErrorState();
      });

      get().fetchRevenueReport();
    },

    // 設定時間間隔
    setInterval: (interval) => {
      set((state) => {
        state.filter.interval = interval;
      });

      get().fetchRevenueReport();
    },

    // 設定課程篩選
    setCourseFilter: (courseId?: string) => {
      set((state) => {
        state.filter.selectedCourseId = courseId || null;
      });

      get().fetchRevenueReport();
    },

    // 設定選中的標籤
    setSelectedTab: (tab) => {
      set((state) => {
        state.selectedTab = tab;
      });
    },

    // 清除錯誤
    clearError: () => {
      set((state) => {
        state.error = getInitialErrorState();
      });
    },

    // 設定錯誤
    setError: (message, type = "unknown") => {
      set((state) => {
        state.error = {
          hasError: true,
          message,
          type,
        };
      });
    },

    // 驗證當前篩選條件
    validateCurrentFilter: () => {
      const { filter } = get();
      return validateDateRange(filter.startDate, filter.endDate);
    },

    // 獲取建議的時間間隔
    getSuggestedInterval: () => {
      const { filter } = get();
      return suggestOptimalInterval(filter.startDate, filter.endDate);
    },

    // 獲取完整統計資料
    getStatistics: () => {
      const { revenueData, filter } = get();

      if (!revenueData) {
        return {
          totalRevenue: 0,
          totalOrders: 0,
          averageOrderValue: 0,
          revenueGrowthRate: 0,
          ordersGrowthRate: 0,
          topRevenueDay: "",
          averageDailyRevenue: 0,
        };
      }

      const dataPoints = revenueData.revenueData;
      const summary = revenueData.summary;

      // 計算成長率
      const midPoint = Math.floor(dataPoints.length / 2);
      const firstHalf = dataPoints.slice(0, midPoint);
      const secondHalf = dataPoints.slice(midPoint);

      const firstHalfRevenue = firstHalf.reduce(
        (sum, item) => sum + (item.totalRevenue || 0),
        0
      );
      const secondHalfRevenue = secondHalf.reduce(
        (sum, item) => sum + (item.totalRevenue || 0),
        0
      );
      const firstHalfOrders = firstHalf.reduce(
        (sum, item) => sum + (item.orderCount || 0),
        0
      );
      const secondHalfOrders = secondHalf.reduce(
        (sum, item) => sum + (item.orderCount || 0),
        0
      );

      // 限制成長率的最大值和最小值
      const calculateLimitedGrowthRate = (
        current: number,
        previous: number
      ) => {
        if (previous === 0) {
          return current > 0 ? 100 : 0;
        }
        const rate = ((current - previous) / previous) * 100;
        return Math.max(Math.min(rate, 200), -200); // 限制在 -200% 到 200% 之間
      };

      const revenueGrowthRate = calculateLimitedGrowthRate(
        secondHalfRevenue,
        firstHalfRevenue
      );
      const ordersGrowthRate = calculateLimitedGrowthRate(
        secondHalfOrders,
        firstHalfOrders
      );

      // 找出收益最高的一天
      const topDay = dataPoints.reduce(
        (max, current) =>
          (current.totalRevenue || 0) > (max.totalRevenue || 0) ? current : max,
        dataPoints[0]
      );

      // 計算平均每日收益
      const daysDiff =
        Math.ceil(
          (filter.endDate.getTime() - filter.startDate.getTime()) /
            (1000 * 60 * 60 * 24)
        ) + 1; // 加1是為了包含開始日期
      const averageDailyRevenue =
        daysDiff > 0 ? summary.totalRevenue / daysDiff : 0;

      return {
        totalRevenue: summary.totalRevenue || 0,
        totalOrders: summary.totalOrders || 0,
        averageOrderValue: summary.averageOrderValue || 0,
        revenueGrowthRate,
        ordersGrowthRate,
        topRevenueDay: topDay?.intervalStart || "",
        averageDailyRevenue,
      };
    },

    // 計算收益成長率
    getRevenueGrowth: () => {
      return get().getStatistics().revenueGrowthRate;
    },

    // 獲取收益最高的一天
    getTopRevenueDay: () => {
      const stats = get().getStatistics();
      const { revenueData } = get();

      if (!revenueData || !stats.topRevenueDay) {
        return null;
      }

      const topDay = revenueData.revenueData.find(
        (item) => item.intervalStart === stats.topRevenueDay
      );

      return topDay
        ? {
            date: topDay.intervalStart,
            revenue: topDay.totalRevenue,
          }
        : null;
    },

    // 計算平均每日收益
    getAverageDailyRevenue: () => {
      return get().getStatistics().averageDailyRevenue;
    },

    // 計算訂單數成長率
    getTotalOrdersGrowth: () => {
      return get().getStatistics().ordersGrowthRate;
    },

    // 計算平均訂單價值成長率
    getAverageOrderValueGrowth: () => {
      const stats = get().getStatistics();
      return stats.revenueGrowthRate - stats.ordersGrowthRate;
    },

    // 應用篩選條件並驗證
    applyFiltersWithValidation: async () => {
      const { filter } = get();

      const validation = validateDashboardForm(
        filter.startDate,
        filter.endDate,
        filter.interval,
        filter.selectedCourseId || undefined
      );

      if (!validation.isValid) {
        const errorMessage =
          Object.values(validation.errors)[0] || "篩選條件無效";
        get().setError(errorMessage, "validation");
        showErrorToast("驗證失敗", errorMessage);
        return false;
      }

      try {
        await get().fetchRevenueReport();
        return true;
      } catch {
        return false;
      }
    },
  }))
);
