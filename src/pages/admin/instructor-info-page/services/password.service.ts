import axios from "@/services/axiosInstance";
import {
  PasswordFormValues,
  ChangePasswordResponseModel,
} from "../models/password.model";
import { AxiosError } from "axios";

/**
 * 更新密碼
 * @param data 密碼更新資料
 * @returns Promise<ChangePasswordResponseModel>
 */
export const updatePassword = async (
  data: PasswordFormValues
): Promise<ChangePasswordResponseModel> => {
  try {
    const response = await axios.put<ChangePasswordResponseModel>(
      "/api/v1/auth/password/change",
      {
        oldPassword: data.oldPassword,
        newPassword: data.newPassword,
        confirmNewPassword: data.confirmNewPassword,
      }
    );

    if (response.data.status === "failed") {
      throw new Error(response.data.message || "密碼變更失敗");
    }

    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data?.message || "密碼變更失敗");
    }
    throw error;
  }
};
