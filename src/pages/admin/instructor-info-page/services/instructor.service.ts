import axios from "@/services/axiosInstance";
import { AxiosError } from "axios";
import { ApiResponseModel } from "@/pages/admin/models/api.model";
import {
  InstructorProfileResponseModel,
  UpdateInstructorProfileModel,
  InstructorProfileModel,
} from "@/pages/admin/instructor-info-page/models/instructor.model";

/**
 * 統一錯誤處理
 * @param error - 捕獲的錯誤
 * @param defaultMessage - 預設錯誤訊息
 * @returns 統一格式的錯誤回應
 */
const handleApiError = <T>(
  error: unknown,
  defaultMessage: string
): ApiResponseModel<T> => {
  if (error instanceof AxiosError) {
    return {
      status: "error",
      message: error.response?.data?.message || defaultMessage,
      data: undefined,
    };
  }
  return {
    status: "error",
    message: "發生未知錯誤，請稍後再試。",
    data: undefined,
  };
};

/**
 * 取得講師個人資料
 */
export const fetchInstructorProfile =
  async (): Promise<InstructorProfileResponseModel> => {
    try {
      const response = await axios.get("/api/v1/instructor/me");
      return response.data;
    } catch (error: unknown) {
      return handleApiError<{ data: InstructorProfileModel }>(
        error,
        "無法取得講師資料，請稍後再試。"
      );
    }
  };

/**
 * 更新講師個人資料
 */
export const updateInstructorProfile = async (
  data: UpdateInstructorProfileModel
): Promise<InstructorProfileResponseModel> => {
  try {
    const response = await axios.put("/api/v1/instructor/me", data);
    return response.data;
  } catch (error: unknown) {
    return handleApiError<{ data: InstructorProfileModel }>(
      error,
      "無法更新講師資料，請稍後再試。"
    );
  }
};
