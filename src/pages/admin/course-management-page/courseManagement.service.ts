import axios from "@/services/axiosInstance";
import { AxiosError } from "axios";
import { ApiResponseModel } from "@/models/api.model";
import {
  CreateCourseModel,
  UpdateCourseModel,
  TogglePublishModel,
  PaginationParamsModel,
  CreateCourseResponse,
  GetCourseDetailResponse,
  UpdateCourseResponse,
  GetCoursesResponse,
  TogglePublishResponse,
  DeleteCourseResponse,
  UploadCoverResponse,
  Course,
  CourseListItemModel,
  PaginationInfoModel
} from "./courseManagement.model";

/**
 * 優化的錯誤處理 - 更詳細地提取 API 錯誤訊息
 * @param error - 捕獲的錯誤
 * @param defaultMessage - 預設錯誤訊息
 * @returns 統一格式的錯誤回應
 */
const handleApiError = <T>(error: unknown, defaultMessage: string): ApiResponseModel<T> => {
  if (error instanceof AxiosError) {
    // 優先使用 API 提供的錯誤訊息
    const apiMessage = error.response?.data?.message || 
                      error.response?.data?.error || 
                      error.response?.data?.detail ||
                      error.message;
    
    // 使用 API 提供的錯誤訊息，如果沒有則使用預設訊息
    const finalMessage = apiMessage || defaultMessage;
    
    return {
      status: "error",
      message: finalMessage,
      data: undefined,
    };
  }
  
  return {
    status: "error",
    message: defaultMessage,
    data: undefined,
  };
};

/**
 * 創建課程 API #32
 * 
 * @param data - 課程建立資料
 * @returns API 回傳的建立結果
 */
export const createCourse = async (
  data: CreateCourseModel
): Promise<CreateCourseResponse> => {
  try {
    const response = await axios.post("/api/v1/instructor/courses", data);
    
    return response.data;
  } catch (error: unknown) {
    return handleApiError<Course>(error, "無法建立課程，請稍後再試。");
  }
};

/**
 * 取得課程詳細資訊 API #34
 * 
 * @param courseId - 課程 ID
 * @returns API 回傳的課程詳細資訊
 */
export const getCourseDetail = async (
  courseId: string
): Promise<GetCourseDetailResponse> => {
  try {
    const response = await axios.get(`/api/v1/instructor/courses/${courseId}`);
    return response.data;
  } catch (error: unknown) {
    return handleApiError<Course>(error, "無法取得課程資訊，請稍後再試。");
  }
};

/**
 * 更新課程 API #35
 * 
 * @param courseId - 課程 ID
 * @param data - 欲更新的課程資料
 * @returns API 回傳的更新結果
 */
export const updateCourse = async (
  courseId: string,
  data: UpdateCourseModel
): Promise<UpdateCourseResponse> => {
  try {
    const response = await axios.put(
      `/api/v1/instructor/courses/${courseId}`,
      data
    );
    return response.data;
  } catch (error: unknown) {
    return handleApiError<Course>(error, "無法更新課程，請稍後再試。");
  }
};

/**
 * 取得課程列表 API #31
 * 
 * @param params - 分頁查詢參數
 * @returns API 回傳的課程列表
 */
export const getCourses = async (
  params: PaginationParamsModel
): Promise<GetCoursesResponse> => {
  try {
    const response = await axios.get("/api/v1/instructor/courses", {
      params,
    });
    return response.data;
  } catch (error: unknown) {
    return handleApiError<{ courseList: CourseListItemModel[]; pagination: PaginationInfoModel }>(
      error,
      "無法取得課程列表，請稍後再試。"
    );
  }
};

/**
 * 切換課程發布狀態 API #49
 * 
 * @param courseId - 課程 ID
 * @param data - 發布狀態資料
 * @returns API 回傳的切換結果
 */
export const toggleCoursePublishStatus = async (
  courseId: string,
  data: TogglePublishModel
): Promise<TogglePublishResponse> => {
  try {
    const response = await axios.patch(
      `/api/v1/instructor/courses/${courseId}/publish`,
      data
    );
    return response.data;
  } catch (error: unknown) {
    return handleApiError<{ courseId: string; isPublished: boolean }>(
      error,
      "無法切換課程發布狀態，請稍後再試。"
    );
  }
};

/**
 * 刪除課程 API #36
 * 
 * @param courseId - 課程 ID
 * @returns API 回傳的刪除結果
 */
export const deleteCourse = async (
  courseId: string
): Promise<DeleteCourseResponse> => {
  try {
    const response = await axios.delete(`/api/v1/instructor/courses/${courseId}`);
    return response.data;
  } catch (error: unknown) {
    return handleApiError<void>(error, "無法刪除課程，請稍後再試。");
  }
};

/**
 * 優化的上傳課程封面 API #33
 * 
 * @param file - 要上傳的圖片檔案
 * @returns API 回傳的上傳結果
 */

export const uploadCourseCoverAlt = async (
  file: File
): Promise<UploadCoverResponse> => {
  try {
    // 檔案驗證（同上）
    const maxSize = 2 * 1024 * 1024;
    if (file.size > maxSize) {
      return {
        status: "error",
        message: "檔案大小不能超過 2MB",
        data: undefined,
      };
    }

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      return {
        status: "error",
        message: "只支援 JPG、PNG、GIF 格式的圖片",
        data: undefined,
      };
    }

    // 使用 axios.postForm
    const response = await (axios as { postForm: typeof axios.post }).postForm(
      "/api/v1/instructor/uploads/cover",
      {
        file: file
      },
      {
        timeout: 30000,
      }
    );

    return response.data;

  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      const apiMessage = error.response?.data?.message || 
                        error.response?.data?.error ||
                        error.response?.data?.detail;
      
      const errorMessage = apiMessage || "圖片上傳失敗，請重試";
      
      return {
        status: "error",
        message: errorMessage,
        data: undefined,
      };
    }
    
    return {
      status: "error",
      message: "網路連線問題，請檢查網路狀態後重試",
      data: undefined,
    };
  }
};