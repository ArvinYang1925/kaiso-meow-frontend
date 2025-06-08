import { ApiResponseModel } from "@/pages/admin/models/api.model";

// ============================
// 🔧 基礎型別定義
// ============================

// 時間間隔類型
export type IntervalType = "day" | "week" | "month" | "year";

// 時間間隔規則型別
export type IntervalRule = {
  minDays: number;
  maxDays: number;
  suggestion: string;
};

// ============================
// 📊 收益相關模型
// ============================

// 收益數據項目模型 (對應 API response.data.revenueData 的項目)
export type RevenueDataItemModel = {
  intervalStart: string;    // 開始時間 (如 "2024-01-15")
  intervalEnd: string;      // 結束時間 (如 "2024-01-15")
  totalRevenue: number;     // 該週期的收益
  orderCount: number;       // 該週期的訂單數量
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
  endTime: string;   // YYYY-MM-DD 格式
  interval: IntervalType;
  courseId?: string; // 可選的課程 ID 篩選
};

// 取得收益報表回應 API #30
export type GetRevenueReportResponse = ApiResponseModel<RevenueReportDataModel>;

// ============================
// 📚 課程相關模型 - 修正版
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

// 課程選項模型（用於下拉選單）- 簡化版
export type CourseOptionModel = {
  id: string;
  title: string;
  createdAt: string;  // 加入建立日期欄位
};

// 課程列表分頁模型
export type CoursePaginationModel = {
  currentPage: number;
  pageSize: number;
  totalPages: number;
  totalItems: number;
};

// 課程列表 API 回應模型 - 修正為使用簡化的課程選項
export type GetCoursesResponse = ApiResponseModel<{
  courseList: CourseOptionModel[]; // 使用簡化模型
  pagination: CoursePaginationModel;
}>;

// ============================
// 🎛️ 前端狀態模型
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

// 前端錯誤狀態類型 - 移除 any
export type ErrorStateModel = {
  hasError: boolean;
  message: string;
  type: "api" | "validation" | "network" | "unknown";
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
// 🔧 調試相關型別 - 基礎版本
// ============================

// API 調試資訊模型 - 移除 any
export type ApiDebugInfo = {
  timestamp: string;
  success: boolean;
  courseCount: number;
  error?: string;
  type: 'manual_debug' | 'simple_test' | 'auto_fetch';
  details?: {
    responseStatus?: number;
    responseData?: unknown;
    errorCode?: string;
  };
};

// 調試狀態模型
export type DebugStateModel = {
  lastApiTest?: ApiDebugInfo;
  apiCallCount: number;
  lastError?: string;
};

// 課程 API 測試結果 - 修正型別匹配
export type CourseApiTestResult = {
  success: boolean;
  courseCount: number;
  error?: string;
  rawData?: {
    status?: string;
    message?: string;
    courseList?: CourseOptionModel[]; // 修正為 CourseOptionModel[]
  };
};

// ============================
// ⚠️ 錯誤處理型別
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
// 📋 常數和配置
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
    endDate
  };
};

// 時間間隔選項
export const INTERVAL_OPTIONS: { value: IntervalType; label: string }[] = [
  { value: "day", label: "天" },
  { value: "week", label: "週" },
  { value: "month", label: "月" },
  { value: "year", label: "年" },
];

// 預設分頁參數
export const DEFAULT_PAGINATION_PARAMS: PaginationParamsModel = {
  page: 1,
  limit: 10,
};

// 獲取所有課程的分頁參數
export const GET_ALL_COURSES_PARAMS: PaginationParamsModel = {
  page: 1,
  pageSize: 50,  // 修改為符合後端限制
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
// 🔧 API 配置常數 - 基礎版
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

// 驗證限制配置
export const VALIDATION_LIMITS = {
  MAX_DATE_RANGE_DAYS: 365,
  MIN_DATE_RANGE_DAYS: 1,
  MAX_COURSE_TITLE_LENGTH: 100,
  MIN_COURSE_TITLE_LENGTH: 1,
  INTERVAL_RULES: {
    day: { minDays: 0, maxDays: 90, suggestion: "建議使用「週」或「月」間隔" },
    week: { minDays: 14, maxDays: 365, suggestion: "建議使用「日」間隔" },
    month: { minDays: 60, maxDays: 730, suggestion: "建議使用「日」或「週」間隔" },
    year: { minDays: 365, maxDays: Infinity, suggestion: "建議使用「月」間隔" },
  } as Record<IntervalType, IntervalRule>,
} as const;

// 快取配置
export const CACHE_CONFIG = {
  TIMEOUT: 5 * 60 * 1000, // 5分鐘
  MAX_ENTRIES: 10,
  COURSE_OPTIONS_TIMEOUT: 10 * 60 * 1000, // 課程選項快取10分鐘
} as const;

// UI 配置
export const UI_CONFIG = {
  DEBOUNCE_DELAY: 300, // 防抖延遲
  AUTO_REFRESH_INTERVAL: 30 * 60 * 1000, // 30分鐘自動更新
  TOAST_DURATION: 5000, // Toast 顯示時間
} as const;