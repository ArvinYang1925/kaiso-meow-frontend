import { ApiResponseModel } from "@/pages/admin/models/api.model";

// ============================
// 基礎型別定義
// ============================

// 時間間隔類型
export type IntervalType = "day" | "week" | "month"; // | "year"; // 暫時註解年選項，後端不支援

// 時間間隔規則型別
export type IntervalRule = {
  minDays: number;
  maxDays: number;
  suggestion: string;
};

// ============================
// 收益相關模型
// ============================

// 收益數據項目模型 (對應 API response.data.revenueData 的項目)
export type RevenueDataItemModel = {
  intervalStart: string; // 開始時間 (如 "2024-01-15")
  intervalEnd: string; // 結束時間 (如 "2024-01-15")
  totalRevenue: number; // 該週期的收益
  orderCount: number; // 該週期的訂單數量
};

// 收益摘要模型 (對應 API response.data.summary)
export type RevenueSummaryModel = {
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
};

// API 查詢參數回應模型 (對應 API response.data.queryParams)
export type RevenueQueryParamsResponseModel = {
  startTime: string;
  endTime: string;
  interval: IntervalType;
  courseId: string | null;
};

// 收益報表完整數據模型 (對應 API response.data)
export type RevenueReportDataModel = {
  summary: {
    totalOrders: number;
    totalRevenue: number;
    averageOrderValue: number;
  };
  revenueData: RevenueDataItemModel[];
  queryParams: {
    startTime: string;
    endTime: string;
    interval: IntervalType;
    courseId: string | null;
  };
};

// 收益查詢參數模型 (對應 API 查詢參數)
export type RevenueQueryParamsModel = {
  startTime: string; // YYYY-MM-DD 格式
  endTime: string; // YYYY-MM-DD 格式
  interval: IntervalType;
  courseId?: string; // 可選的課程 ID 篩選
};

// 取得收益報表回應 API #30
export type GetRevenueReportResponse = ApiResponseModel<RevenueReportDataModel>;

// ============================
// 課程相關模型
// ============================

// 分頁查詢參數模型
export type PaginationParamsModel = {
  page?: number;
  pageSize?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
};

// 課程列表項目模型 - 支援多種欄位名稱
export type CourseListItemModel = {
  // 主要欄位
  id: string;
  instructorName: string;
  title: string;
  coverUrl: string | null;
  isFree: boolean;
  price: number;
  isPublished: boolean;
  studentCount: number;
  createdAt: string;

  // 可選的替代欄位名稱（API 可能使用不同命名）
  courseId?: string;
  _id?: string;
  uuid?: string;
  name?: string;
  courseName?: string;
  displayName?: string;
};

// 課程選項模型（用於下拉選單）
export type CourseOptionModel = {
  id: string;
  title: string;
  createdAt: string; // 加入建立日期欄位
};

// 課程列表分頁模型
export type CoursePaginationModel = {
  currentPage: number;
  pageSize: number;
  totalPages: number;
  totalItems: number;
};

// 課程列表 API 回應模型
export type GetCoursesResponse = ApiResponseModel<{
  courseList: CourseOptionModel[]; // 使用簡化模型
  pagination: CoursePaginationModel;
}>;

// ============================
// 前端狀態模型
// ============================

// 前端篩選條件模型
export type RevenueFilterModel = {
  startDate: Date;
  endDate: Date;
  interval: IntervalType;
  selectedCourseId: string | null;
};

// 收益圖表數據類型
export type RevenueChartDataModel = {
  labels: string[];
  datasets: {
    label?: string;
    data: number[];
    borderColor?: string;
    backgroundColor?: string;
    fill?: boolean;
  }[];
};

// 前端錯誤狀態類型
export type ErrorStateModel = {
  hasError: boolean;
  message: string; // 直接使用後端返回的 message
  type: "api" | "validation" | "network" | "timeout" | "unknown";
  timestamp?: Date;
  details?: {
    statusCode?: number;
    endpoint?: string;
    method?: string;
  };
};

// 數據更新狀態
export type DataUpdateStateModel = {
  lastUpdated: Date | null;
  isAutoRefresh: boolean;
  refreshInterval: number; // 毫秒
};

// 統計計算結果
export type StatisticsCalculationResult = {
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  revenueGrowthRate: number;
  ordersGrowthRate: number;
  topRevenueDay: string;
  averageDailyRevenue: number;
};

// 表單驗證狀態
export type FormValidationState = {
  isValid: boolean;
  errors: {
    startDate?: string;
    endDate?: string;
    dateRange?: string;
    courseId?: string;
  };
};

// 日期範圍驗證結果
export type DateRangeValidationResult = {
  isValid: boolean;
  error?: string;
};

// ============================
// 年統計相關型別
// ============================
export type YearStatisticsOptions = {
  autoAdjustDateRange: boolean; // 是否自動調整日期範圍
  fallbackToMonth: boolean; // 是否降級到月統計
  showWarningDialog: boolean; // 是否顯示警告對話框
};

export const DEFAULT_YEAR_OPTIONS: YearStatisticsOptions = {
  autoAdjustDateRange: true,
  fallbackToMonth: true,
  showWarningDialog: true,
};

// ============================
// 錯誤處理型別
// ============================

// API 錯誤回應模型
export type RevenueApiErrorResponse = {
  status: "failed" | "error";
  message: string;
  code?: string;
  details?: {
    endpoint?: string;
    method?: string;
    statusCode?: number;
  };
};

// 課程 API 錯誤回應模型
export type CourseApiErrorResponse = {
  status: "failed" | "error";
  message: string;
  code?: string;
  endpoint?: string;
  details?: {
    originalError?: string;
    responseData?: unknown;
  };
};

// ============================
// 工具函數型別
// ============================

// 日期格式化工具函數類型
export type DateFormatter = (date: Date, format?: string) => string;

// 貨幣格式化工具函數類型
export type CurrencyFormatter = (amount: number) => string;

// API 日期格式化工具函數類型
export type ApiDateFormatter = (date: Date) => string;

// ============================
// 常數和配置
// ============================

// 預設時間間隔
export const DEFAULT_INTERVAL: IntervalType = "day";

// 預設日期範圍（過去30天）
export const getDefaultDateRange = () => {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(endDate.getDate() - 30);

  return {
    startDate,
    endDate,
  };
};

// 預設日期範圍函數
export const getDefaultDateRangeForInterval = (interval: IntervalType) => {
  const endDate = new Date();
  const startDate = new Date();

  switch (interval) {
    case "day":
      startDate.setDate(endDate.getDate() - 30); // 30天
      break;
    case "week":
      startDate.setDate(endDate.getDate() - 56); // 8週
      break;
    case "month":
      startDate.setMonth(endDate.getMonth() - 6); // 6個月
      break;
    // case "year": // 暫時註解年間隔，後端不支援
    //   startDate.setFullYear(endDate.getFullYear() - 2); // 2年
    //   break;
    default:
      startDate.setDate(endDate.getDate() - 30);
  }

  return { startDate, endDate };
};

// 時間間隔選項 - 更清楚的標籤
export const INTERVAL_OPTIONS: { value: IntervalType; label: string }[] = [
  { value: "day", label: "日" },
  { value: "week", label: "週" },
  { value: "month", label: "月" },
  // { value: "year", label: "年" }, // 暫時註解年選項，後端不支援
];

// 預設分頁參數
export const DEFAULT_PAGINATION_PARAMS: PaginationParamsModel = {
  page: 1,
  limit: 10,
};

// 獲取所有課程的分頁參數
export const GET_ALL_COURSES_PARAMS: PaginationParamsModel = {
  page: 1,
  pageSize: 50, // 修改為符合後端限制
};

// 預設篩選條件
export const getDefaultFilter = (): RevenueFilterModel => {
  const { startDate, endDate } = getDefaultDateRange();
  return {
    startDate,
    endDate,
    interval: DEFAULT_INTERVAL,
    selectedCourseId: null,
  };
};

// 圖表色彩配置
export const CHART_COLORS = {
  primary: "hsl(142.1, 76.2%, 36.3%)",
  chart1: "hsl(142.1, 76.2%, 45%)",
  chart2: "hsl(142.1, 65%, 40%)",
  chart3: "hsl(142.1, 55%, 35%)",
  chart4: "hsl(142.1, 45%, 30%)",
  chart5: "hsl(142.1, 35%, 25%)",

  // 藍色系列（用於主要圖表）
  sky400: "hsl(198, 93%, 60%)",
  sky300: "hsl(199, 95%, 74%)",
  sky500: "hsl(199, 89%, 48%)",
  sky600: "hsl(200, 98%, 39%)",
  sky700: "hsl(201, 96%, 32%)",
  sky800: "hsl(201, 90%, 27%)",
} as const;

// 圖表配置類型
export type ChartColorsType = typeof CHART_COLORS;

// ============================
// API 配置常數
// ============================

// API 端點配置
export const API_ENDPOINTS = {
  REVENUE: "/api/v1/instructor/revenue",
  COURSES: "/api/v1/instructor/courses",
} as const;

// API 超時配置
export const API_TIMEOUTS = {
  REVENUE_REPORT: 15000, // 15秒
  COURSE_OPTIONS: 10000, // 10秒
  DEFAULT: 8000, // 8秒
} as const;

// 前端專用錯誤訊息 - 只保留前端特有的情況
export const FRONTEND_ERROR_MESSAGES = {
  NETWORK_ERROR: "網路連線錯誤，請檢查網路狀態",
  TIMEOUT_ERROR: "請求超時，請稍後再試",
  UNKNOWN_ERROR: "發生未知錯誤，請聯繫技術支援",
} as const;

// 時間間隔驗證限制配置
export const VALIDATION_LIMITS = {
  MAX_DATE_RANGE_DAYS: 730, // 增加到2年，支援年統計
  MIN_DATE_RANGE_DAYS: 1,
  MAX_COURSE_TITLE_LENGTH: 100,
  MIN_COURSE_TITLE_LENGTH: 1,
  INTERVAL_RULES: {
    day: {
      minDays: 1, // 修正：最少需要1天
      maxDays: 31, // 修正：建議最多31天
      suggestion: "建議日期範圍不超過31天時使用日統計",
    },
    week: {
      minDays: 7, // 修正：週統計至少需要7天
      maxDays: 90, // 修正：建議最多90天
      suggestion: "建議日期範圍在7-90天之間時使用週統計",
    },
    month: {
      minDays: 30, // 修正：月統計至少需要30天
      maxDays: 365, // 修正：建議最多365天
      suggestion: "建議日期範圍在30-365天之間時使用月統計",
    },
    // year: { // 暫時註解年間隔，後端不支援
    //   minDays: 90,       // 年統計建議至少90天（不強制）
    //   maxDays: Infinity, // 保持無限制
    //   suggestion: "建議日期範圍超過90天時使用年統計，最佳效果為365天以上（僅供參考，不會阻擋查詢）"
    // },
  } as Record<IntervalType, IntervalRule>,
} as const;

// 年統計專用配置
// export const YEAR_STATISTICS_CONFIG = {
//   MIN_RECOMMENDED_DAYS: 90,     // 年統計建議最少天數
//   OPTIMAL_DAYS: 365,            // 年統計最佳天數
//   AUTO_ADJUST_THRESHOLD: 30,    // 少於30天自動調整門檻
//   DEFAULT_RANGE_YEARS: 1,       // 預設範圍（年）
// } as const;

// 快取配置
export const CACHE_CONFIG = {
  TIMEOUT: 5 * 60 * 1000, // 5分鐘
  MAX_ENTRIES: 10,
  COURSE_OPTIONS_TIMEOUT: 10 * 60 * 1000, // 課程選項快取10分鐘
} as const;

// UI 配置
export const UI_CONFIG = {
  DEBOUNCE_DELAY: 300,
  AUTO_REFRESH_INTERVAL: 30 * 60 * 1000, // 30分鐘自動更新
  TOAST_DURATION: 5000, // Toast 顯示時間
} as const;

// ============================
// 輔助函數
// ============================

// 智能間隔選擇器函數
export const getRecommendedInterval = (daysDiff: number): IntervalType => {
  if (daysDiff <= 31) return "day";
  if (daysDiff <= 90) return "week";
  // if (daysDiff <= 365) return "month";
  // return "year"; // 暫時註解年間隔，後端不支援
  return "month"; // 最大間隔改為月
};

// 間隔驗證輔助函數（僅用於 UI 提示，不阻止 API 請求）
export const isIntervalValidForRange = (
  daysDiff: number,
  interval: IntervalType
): { isValid: boolean; message?: string; suggestion?: IntervalType } => {
  const rule = VALIDATION_LIMITS.INTERVAL_RULES[interval];

  // 特殊處理：年間隔不阻擋請求，只提供建議（暫時註解，後端不支援）
  // if (interval === "year") {
  //   return { isValid: true }; // 年間隔總是允許通過
  // }

  if (daysDiff < rule.minDays) {
    const recommended = getRecommendedInterval(daysDiff);
    return {
      isValid: false,
      message: `日期範圍過短（${daysDiff}天），${rule.suggestion}`,
      suggestion: recommended,
    };
  }

  if (rule.maxDays !== Infinity && daysDiff > rule.maxDays) {
    const recommended = getRecommendedInterval(daysDiff);
    return {
      isValid: false,
      message: `日期範圍過長（${daysDiff}天），${rule.suggestion}`,
      suggestion: recommended,
    };
  }

  return { isValid: true };
};

// 計算兩個日期之間的天數差
export const calculateDaysDifference = (
  startDate: Date,
  endDate: Date
): number => {
  const timeDiff = endDate.getTime() - startDate.getTime();
  return Math.ceil(timeDiff / (1000 * 3600 * 24));
};
