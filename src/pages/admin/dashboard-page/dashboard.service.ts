import axios from "@/services/axiosInstance";
import { AxiosError } from "axios";
import { ApiResponseModel } from "@/pages/admin/models/api.model";
import {
  RevenueQueryParamsModel,
  GetRevenueReportResponse,
  RevenueReportDataModel,
  GetCoursesResponse,
  IntervalType,
  DateRangeValidationResult,
  FormValidationState,
  CourseOptionModel,
  IntervalRule,
  API_TIMEOUTS,
  API_ENDPOINTS,
  VALIDATION_LIMITS,
  CoursePaginationModel,
} from "./dashboard.model";

// ============================
// API 配置常數 - 使用 MODEL 中的配置
// ============================
const API_CONFIG = {
  TIMEOUTS: API_TIMEOUTS,
  ENDPOINTS: API_ENDPOINTS,
  PAGINATION: {
    DEFAULT_PAGE: 1,
    MAX_COURSES_LIMIT: 50,
  },
} as const;

// ============================
// 錯誤處理工具
// ============================

/**
 * 統一的 API 錯誤處理函數 - 優先使用 API 回傳的錯誤訊息
 */
const handleApiError = <T>(
  error: unknown,
  defaultMessage: string
): ApiResponseModel<T> => {
  // 如果是 AxiosError 且有 response
  if (error instanceof AxiosError && error.response?.data) {
    const responseData = error.response.data as ApiResponseModel<unknown>;
    
    // 優先使用 API 回傳的標準格式
    if (responseData && typeof responseData === 'object') {
      return {
        status: responseData.status || "error",
        message: responseData.message || defaultMessage,
        data: undefined,
      };
    }
  }

  // 如果是一般的 Error
  if (error instanceof Error) {
    return {
      status: "error",
      message: error.message || defaultMessage,
      data: undefined,
    };
  }

  // 最後的預設情況
  return {
    status: "error",
    message: defaultMessage,
    data: undefined,
  };
};

// ============================
// API 呼叫函數
// ============================

/**
 * 取得收益報表 API #30
 */
export const getInstructorRevenue = async (
  params: RevenueQueryParamsModel
): Promise<GetRevenueReportResponse> => {
  try {
    const queryParams: Record<string, string> = {
      startTime: params.startTime,
      endTime: params.endTime,
      interval: params.interval,
    };

    if (params.courseId && params.courseId !== "all") {
      queryParams.courseId = params.courseId;
    }

    const response = await axios.get(API_CONFIG.ENDPOINTS.REVENUE, {
      params: queryParams,
      timeout: API_CONFIG.TIMEOUTS.REVENUE_REPORT,
    });

    if (!response.data || typeof response.data !== 'object') {
      throw new Error("API 回應格式無效");
    }

    if (!response.data.data?.revenueData || !Array.isArray(response.data.data.revenueData)) {
      throw new Error("API 回應缺少必要的收益數據");
    }

    if (!response.data.data?.summary || typeof response.data.data.summary !== 'object') {
      throw new Error("API 回應缺少必要的摘要數據");
    }

    return response.data;
  } catch (error: unknown) {
    return handleApiError<RevenueReportDataModel>(
      error,
      "無法取得收益報表，請稍後再試"
    );
  }
};

/**
 * 取得講師課程列表 API #31
 */
export const getInstructorCourses = async (): Promise<GetCoursesResponse> => {
  try {
    const params = {
      page: API_CONFIG.PAGINATION.DEFAULT_PAGE,
      pageSize: API_CONFIG.PAGINATION.MAX_COURSES_LIMIT,
    };
    
    const response = await axios.get(API_CONFIG.ENDPOINTS.COURSES, {
      params,
      timeout: API_CONFIG.TIMEOUTS.COURSE_OPTIONS,
    });
    
    if (!response.data || typeof response.data !== 'object') {
      throw new Error("API 回應格式無效");
    }
    
    return response.data;
  } catch (error: unknown) {
    return handleApiError<{
      courseList: CourseOptionModel[];
      pagination: CoursePaginationModel;
    }>(error, "無法取得課程列表");
  }
};

// ============================
// 日期驗證工具
// ============================

/**
 * 驗證日期是否有效
 */
const isValidDate = (date: Date): boolean => {
  return date instanceof Date && !isNaN(date.getTime());
};

/**
 * 驗證日期範圍
 */
export const validateDateRange = (
  startDate: Date,
  endDate: Date
): DateRangeValidationResult => {
  if (!isValidDate(startDate) || !isValidDate(endDate)) {
    return {
      isValid: false,
      error: "請選擇有效的日期",
    };
  }

  if (startDate > endDate) {
    return {
      isValid: false,
      error: "開始日期不能大於結束日期",
    };
  }

  const today = new Date();
  today.setHours(23, 59, 59, 999);
  
  if (endDate > today) {
    return {
      isValid: false,
      error: "結束日期不能大於今天",
    };
  }

  const daysDiff = getDateRangeDays(startDate, endDate);
  if (daysDiff > VALIDATION_LIMITS.MAX_DATE_RANGE_DAYS) {
    return {
      isValid: false,
      error: `日期範圍不能超過 ${VALIDATION_LIMITS.MAX_DATE_RANGE_DAYS} 天`,
    };
  }

  return { isValid: true };
};

/**
 * 驗證表單完整性
 */
export const validateDashboardForm = (
  startDate: Date,
  endDate: Date,
  interval: IntervalType,
  courseId?: string
): FormValidationState => {
  const errors: FormValidationState["errors"] = {};

  const dateValidation = validateDateRange(startDate, endDate);
  if (!dateValidation.isValid) {
    errors.dateRange = dateValidation.error;
  }

  const intervalValidation = validateIntervalForDateRange(startDate, endDate, interval);
  if (!intervalValidation.isValid) {
    errors.dateRange = intervalValidation.message;
  }

  if (courseId && courseId !== "all" && typeof courseId !== "string") {
    errors.courseId = "無效的課程 ID";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * 驗證時間間隔是否適合日期範圍
 */
export const validateIntervalForDateRange = (
  startDate: Date,
  endDate: Date,
  interval: IntervalType
): { isValid: boolean; message?: string; suggestion?: string } => {
  const daysDiff = getDateRangeDays(startDate, endDate);
  const rule: IntervalRule | undefined = VALIDATION_LIMITS.INTERVAL_RULES[interval];

  if (!rule) {
    return {
      isValid: false,
      message: "無效的時間間隔",
    };
  }

  if (daysDiff < rule.minDays) {
    return {
      isValid: false,
      message: `日期範圍過短（${daysDiff} 天），不適合使用「${getIntervalLabel(interval)}」間隔`,
      suggestion: rule.suggestion,
    };
  }

  if (rule.maxDays !== Infinity && daysDiff > rule.maxDays) {
    return {
      isValid: false,
      message: `日期範圍過長（${daysDiff} 天），不適合使用「${getIntervalLabel(interval)}」間隔`,
      suggestion: rule.suggestion,
    };
  }

  return { isValid: true };
};

/**
 * 根據日期範圍智能建議最佳時間間隔
 */
export const suggestOptimalInterval = (
  startDate: Date,
  endDate: Date
): IntervalType => {
  const daysDiff = getDateRangeDays(startDate, endDate);

  if (daysDiff <= 30) return "day";
  if (daysDiff <= 90) return "week";
  if (daysDiff <= 365) return "month";
  return "year";
};

// ============================
// 格式化工具
// ============================

/**
 * 格式化日期為 API 所需格式 (YYYY-MM-DD)
 */
export const formatDateForAPI = (date: Date): string => {
  if (!isValidDate(date)) {
    throw new Error("無效的日期格式");
  }
  
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
};

/**
 * 格式化貨幣顯示
 */
export const formatCurrency = (
  amount: number,
  currency: string = "TWD"
): string => {
  if (typeof amount !== "number" || isNaN(amount)) {
    return currency === "TWD" ? "NT$ 0" : "0";
  }

  return new Intl.NumberFormat("zh-TW", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * 格式化數字 (千分位逗號)
 */
export const formatNumber = (num: number): string => {
  if (typeof num !== "number" || isNaN(num)) {
    return "0";
  }
  return new Intl.NumberFormat("zh-TW").format(num);
};

/**
 * 格式化成長率 (帶正負號)
 */
export const formatGrowthRate = (
  value: number,
  decimals: number = 1
): string => {
  if (typeof value !== "number" || isNaN(value)) {
    return "0.0%";
  }
  const sign = value >= 0 ? "+" : "";
  return `${sign}${value.toFixed(decimals)}%`;
};

// ============================
// 計算工具
// ============================

/**
 * 安全的數字解析
 */
export const safeParseNumber = (
  value: unknown,
  defaultValue: number = 0
): number => {
  if (typeof value === "number" && !isNaN(value)) {
    return value;
  }
  
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (trimmed === "") return defaultValue;
    
    const parsed = parseFloat(trimmed);
    return isNaN(parsed) ? defaultValue : parsed;
  }
  
  return defaultValue;
};

/**
 * 計算成長率
 */
export const calculateGrowthRate = (
  current: number,
  previous: number
): number => {
  const currentNum = safeParseNumber(current);
  const previousNum = safeParseNumber(previous);

  if (previousNum === 0) {
    return currentNum > 0 ? 100 : 0;
  }

  return ((currentNum - previousNum) / previousNum) * 100;
};

/**
 * 計算平均值
 */
export const calculateAverage = (values: number[]): number => {
  if (!Array.isArray(values) || values.length === 0) {
    return 0;
  }

  const validValues = values
    .map(v => safeParseNumber(v))
    .filter(v => !isNaN(v));
    
  if (validValues.length === 0) {
    return 0;
  }

  const sum = validValues.reduce((acc, val) => acc + val, 0);
  return sum / validValues.length;
};

// ============================
// 工具函數
// ============================

/**
 * 檢查 API 回應是否成功
 */
export const isApiResponseSuccess = <T>(
  response: ApiResponseModel<T>
): response is ApiResponseModel<T> & { data: NonNullable<T> } => {
  return Boolean(
    response &&
    response.status === "success" &&
    response.data !== undefined &&
    response.data !== null
  );
};

/**
 * 獲取時間間隔的中文標籤
 */
export const getIntervalLabel = (interval: IntervalType): string => {
  const labels: Record<IntervalType, string> = {
    day: "日",
    week: "週",
    month: "月",
    year: "年",
  };
  return labels[interval] || interval;
};

/**
 * 建立查詢參數快取鍵
 */
export const createCacheKey = (params: RevenueQueryParamsModel): string => {
  const normalized = {
    startTime: params.startTime,
    endTime: params.endTime,
    interval: params.interval,
    courseId: params.courseId || null,
  };
  return JSON.stringify(normalized);
};

/**
 * 防抖函數 - 避免頻繁 API 呼叫
 */
export const debounce = <T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

/**
 * 獲取日期範圍的天數
 */
export const getDateRangeDays = (startDate: Date, endDate: Date): number => {
  if (!isValidDate(startDate) || !isValidDate(endDate)) {
    return 0;
  }
  
  const diffTime = endDate.getTime() - startDate.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
};