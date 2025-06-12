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
 * 優化的錯誤處理 - 僅使用 API 回傳的錯誤訊息
 * @param error - 捕獲的錯誤
 * @returns 統一格式的錯誤回應
 */
const handleApiError = <T>(error: unknown): ApiResponseModel<T> => {
  if (error instanceof AxiosError) {
    const apiMessage =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.response?.data?.detail ||
      error.message;

    return {
      status: "error",
      message: apiMessage || "",
      data: undefined,
    };
  }

  return {
    status: "error",
    message: "",
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
    return handleApiError<Course>(error);
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
    return handleApiError<Course>(error);
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
    return handleApiError<Course>(error);
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
    return handleApiError<{
      courseList: CourseListItemModel[];
      pagination: PaginationInfoModel;
    }>(error);
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
    return handleApiError<{ courseId: string; isPublished: boolean }>(error);
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
    const response = await axios.delete(
      `/api/v1/instructor/courses/${courseId}`
    );

    if (response.status === 200 || response.status === 204) {
      if (!response.data || Object.keys(response.data).length === 0) {
        return {
          status: "success",
          message: "",
          data: undefined,
        };
      }

      // 如果有回應資料但沒有 status 欄位，假設成功
      if (response.data && !response.data.status) {
        return {
          status: "success",
          message: response.data.message || "",
          data: response.data.data,
        };
      }
      return response.data;
    }

    return {
      status: "error",
      message: "",
      data: undefined,
    };
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      const responseData = error.response?.data;

      const errorMessage =
        responseData?.message ||
        responseData?.error ||
        responseData?.detail ||
        error.message ||
        "";

      return {
        status: "error",
        message: errorMessage,
        data: undefined,
      };
    }

    return {
      status: "error",
      message: "",
      data: undefined,
    };
  }
};

/**
 * 上傳課程封面 API #33
 *
 * @param file - 要上傳的圖片檔案
 * @returns API 回傳的上傳結果
 */
export const uploadCourseCoverAlt = async (
  file: File
): Promise<UploadCoverResponse> => {
  try {
    // 移除本地檔案驗證，讓 API 處理驗證並回傳訊息
    const response = await (axios as { postForm: typeof axios.post }).postForm(
      "/api/v1/instructor/uploads/cover",
      {
        file: file,
      },
      {
        timeout: 30000,
      }
    );

    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      const apiMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.response?.data?.detail ||
        error.message;

      return {
        status: "error",
        message: apiMessage || "",
        data: undefined,
      };
    }

    return {
      status: "error",
      message: "",
      data: undefined,
    };
  }
};
