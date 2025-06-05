import axios from "@/services/axiosInstance";
import { AxiosError } from "axios";
import { ApiResponseModel } from "@/pages/admin/models/api.model";
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
  PaginationInfoModel,
} from "./courseManagement.model";

/**
 * 優化的錯誤處理 - 更詳細地提取 API 錯誤訊息
 * @param error - 捕獲的錯誤
 * @param defaultMessage - 預設錯誤訊息
 * @returns 統一格式的錯誤回應
 */
const handleApiError = <T>(
  error: unknown,
  defaultMessage: string
): ApiResponseModel<T> => {
  console.error("API Error:", error); // 添加錯誤日誌

  if (error instanceof AxiosError) {
    // 優先使用 API 提供的錯誤訊息
    const apiMessage =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.response?.data?.detail ||
      error.message;

    // 記錄詳細錯誤信息
    console.error("AxiosError details:", {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message,
    });

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
    console.log("Creating course with data:", data);
    const response = await axios.post("/api/v1/instructor/courses", data);
    console.log("Create course response:", response.data);

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
    console.log("Fetching course detail for ID:", courseId);
    const response = await axios.get(`/api/v1/instructor/courses/${courseId}`);
    console.log("Course detail response:", response.data);

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
    console.log("Updating course:", courseId, "with data:", data);
    const response = await axios.put(
      `/api/v1/instructor/courses/${courseId}`,
      data
    );
    console.log("Update course response:", response.data);

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
    console.log("Fetching courses with params:", params);
    const response = await axios.get("/api/v1/instructor/courses", {
      params,
    });
    console.log("Get courses response:", response.data);

    return response.data;
  } catch (error: unknown) {
    return handleApiError<{
      courseList: CourseListItemModel[];
      pagination: PaginationInfoModel;
    }>(error, "無法取得課程列表，請稍後再試。");
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
    console.log(
      "Toggling publish status for course:",
      courseId,
      "to:",
      data.isPublished
    );
    const response = await axios.patch(
      `/api/v1/instructor/courses/${courseId}/publish`,
      data
    );
    console.log("Toggle publish response:", response.data);

    return response.data;
  } catch (error: unknown) {
    return handleApiError<{ courseId: string; isPublished: boolean }>(
      error,
      "無法切換課程發布狀態，請稍後再試。"
    );
  }
};

/**
 * 刪除課程 API #36 - 最終修正版本，強化錯誤訊息處理
 *
 * @param courseId - 課程 ID
 * @returns API 回傳的刪除結果
 */
export const deleteCourse = async (
  courseId: string
): Promise<DeleteCourseResponse> => {
  try {
    console.log("Service: Deleting course with ID:", courseId);

    const response = await axios.delete(
      `/api/v1/instructor/courses/${courseId}`
    );

    console.log("Service: Delete course response:", response);
    console.log("Service: Delete course response data:", response.data);
    console.log("Service: Delete course response status:", response.status);

    // 檢查 HTTP 狀態碼
    if (response.status === 200 || response.status === 204) {
      // 如果 API 只回傳 HTTP 狀態碼而沒有 response body，我們創建一個成功的回應
      if (!response.data || Object.keys(response.data).length === 0) {
        console.log("Service: No response body, assuming success");
        return {
          status: "success",
          message: "課程刪除成功",
          data: undefined,
        };
      }

      // 如果有回應資料但沒有 status 欄位，我們假設成功
      if (response.data && !response.data.status) {
        console.log(
          "Service: Response data without status field, assuming success"
        );
        return {
          status: "success",
          message: response.data.message || "課程刪除成功",
          data: response.data.data,
        };
      }

      // 正常回應格式
      console.log("Service: Standard response format");
      return response.data;
    }

    // 如果狀態碼不是成功的，建立錯誤回應
    console.log("Service: Non-success status code:", response.status);
    return {
      status: "error",
      message: "刪除課程時發生未知錯誤",
      data: undefined,
    };
  } catch (error: unknown) {
    console.error("Service: Delete course error:", error);

    // 特別處理 AxiosError 中的錯誤訊息
    if (error instanceof AxiosError) {
      console.log("Service: Processing AxiosError");

      // 檢查回應狀態碼
      const status = error.response?.status;
      const responseData = error.response?.data;

      console.log("Service: Error status:", status);
      console.log("Service: Error response data:", responseData);

      // 提取錯誤訊息
      const errorMessage =
        responseData?.message ||
        responseData?.error ||
        responseData?.detail ||
        error.message ||
        "無法刪除課程，請稍後再試。";

      console.log("Service: Extracted error message:", errorMessage);

      return {
        status: "error",
        message: errorMessage,
        data: undefined,
      };
    }

    // 處理其他類型的錯誤
    console.log("Service: Processing non-AxiosError");
    return {
      status: "error",
      message: "無法刪除課程，請稍後再試。",
      data: undefined,
    };
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
    console.log("Uploading course cover:", file.name, file.size, file.type);

    // 檔案驗證（同上）
    const maxSize = 2 * 1024 * 1024;
    if (file.size > maxSize) {
      return {
        status: "error",
        message: "檔案大小不能超過 2MB",
        data: undefined,
      };
    }

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];
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
        file: file,
      },
      {
        timeout: 30000,
      }
    );

    console.log("Upload cover response:", response.data);
    return response.data;
  } catch (error: unknown) {
    console.error("Upload cover error:", error);

    if (error instanceof AxiosError) {
      const apiMessage =
        error.response?.data?.message ||
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
