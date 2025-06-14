import axios from "@/services/axiosInstance";
import { AxiosError } from "axios";
import { ApiResponseModel } from "@/pages/admin/models/api.model";
import {
  InstructorProfileResponseModel,
  UpdateInstructorProfileModel,
  InstructorProfileModel,
} from "../models/instructor.model";

// 定義上傳頭像回應的數據類型
interface AvatarUploadData {
  url?: string; // 最常見的通用上傳回應字段
  imageUrl?: string; // 圖片上傳專用字段
  avatarUrl?: string; // 頭像專用字段（通用上傳可能使用）
  profileUrl?: string; // 講師資料字段
  coverUrl?: string; // 封面圖片字段
}

/**
 * 統一錯誤處理
 */
const handleApiError = <T>(
  error: unknown,
  defaultMessage: string
): ApiResponseModel<T> => {
  if (error instanceof AxiosError) {
    const apiMessage =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.response?.data?.detail;

    const errorMessage = apiMessage || error.message || defaultMessage;

    return {
      status: "error",
      message: errorMessage,
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
 * 講師相關 API 服務
 */
export const instructorService = {
  /**
   * 取得講師個人資料 API#26
   */
  fetchProfile: async (): Promise<InstructorProfileResponseModel> => {
    try {
      const timestamp = Date.now();
      const response = await axios.get(`/api/v1/instructor/me?_t=${timestamp}`);
      return response.data;
    } catch (error: unknown) {
      return handleApiError<InstructorProfileModel>(
        error,
        "無法取得講師資料，請稍後再試。"
      );
    }
  },

  /**
   * 更新講師個人資料（包含頭像URL） API#27
   */
  updateProfile: async (
    data: UpdateInstructorProfileModel
  ): Promise<InstructorProfileResponseModel> => {
    try {
      const response = await axios.put("/api/v1/instructor/me", data);
      return response.data;
    } catch (error: unknown) {
      return handleApiError<InstructorProfileModel>(
        error,
        "無法更新講師資料，請稍後再試。"
      );
    }
  },

  /**
   * 上傳圖片檔案 API#28
   */
  uploadImageFile: async (
    file: File
  ): Promise<ApiResponseModel<AvatarUploadData>> => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      // 只嘗試講師專用的頭像上傳端點，避免 404
      const response = await axios.post(
        "/api/v1/instructor/upload/avatar",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          timeout: 30000,
        }
      );

      // 檢查 HTTP 狀態碼
      if (response.status !== 200) {
        return {
          status: "error",
          message: `HTTP 錯誤：${response.status}`,
          data: undefined,
        };
      }

      // 處理回應數據
      if (response.data) {
        if (response.data.status === "success" && response.data.data) {
          const timestamp = Date.now();
          const responseData = { ...response.data };
          const imageFields = [
            "avatarUrl",
            "profileUrl",
            "url",
            "imageUrl",
            "coverUrl",
          ];
          for (const field of imageFields) {
            if (responseData.data[field]) {
              const originalUrl = responseData.data[field];
              responseData.data[field] = originalUrl.includes("?")
                ? `${originalUrl}&_t=${timestamp}`
                : `${originalUrl}?_t=${timestamp}`;
              break;
            }
          }
          return responseData as ApiResponseModel<AvatarUploadData>;
        }
        return response.data as ApiResponseModel<AvatarUploadData>;
      }

      // 如果沒有 data，回傳錯誤
      return {
        status: "error",
        message: "伺服器回應為空",
        data: undefined,
      };
    } catch (error: unknown) {
      return handleApiError<AvatarUploadData>(
        error,
        "無法上傳圖片，請稍後再試。"
      );
    }
  },

  /**
   * 上傳講師頭像（直接存檔到講師資料庫） API#28
   * 注意：此方法會直接更新講師的頭像，不需要額外調用 updateProfile
   */
  uploadAvatar: async (
    file: File
  ): Promise<ApiResponseModel<AvatarUploadData>> => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      // 只嘗試講師專用的頭像上傳端點
      const response = await axios.post(
        "/api/v1/instructor/upload/avatar",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          timeout: 30000, // 30秒超時
        }
      );

      // 檢查 HTTP 狀態碼
      if (response.status !== 200) {
        return {
          status: "error",
          message: `HTTP 錯誤：${response.status}`,
          data: undefined,
        };
      }

      if (response.data) {
        if (response.data.status === "success" && response.data.data) {
          const timestamp = Date.now();
          const responseData = { ...response.data };
          const imageFields = [
            "avatarUrl",
            "profileUrl",
            "url",
            "imageUrl",
            "coverUrl",
          ];
          for (const field of imageFields) {
            if (responseData.data[field]) {
              const originalUrl = responseData.data[field];
              responseData.data[field] = originalUrl.includes("?")
                ? `${originalUrl}&_t=${timestamp}`
                : `${originalUrl}?_t=${timestamp}`;
              break;
            }
          }
          return responseData as ApiResponseModel<AvatarUploadData>;
        }
        return response.data as ApiResponseModel<AvatarUploadData>;
      }
      return {
        status: "error",
        message: "伺服器回應為空",
        data: undefined,
      };
    } catch (error: unknown) {
      return handleApiError<AvatarUploadData>(
        error,
        "無法上傳頭像，請稍後再試。"
      );
    }
  },
};
