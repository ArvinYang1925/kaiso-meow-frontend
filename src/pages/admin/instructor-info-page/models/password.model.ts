import { ApiResponseModel } from "../../models/api.model";

/**
 * 密碼表單資料
 */
export type PasswordFormValues = {
  oldPassword: string;
  newPassword: string;
  confirmNewPassword: string;
};

/**
 * 變更密碼請求資料
 */
export type ChangePasswordRequestModel = {
  oldPassword: string;
  newPassword: string;
  confirmNewPassword: string;
};

/**
 * API 回應變更密碼資料
 */
export type ChangePasswordResponseModel = ApiResponseModel<{
  data: ChangePasswordRequestModel;
}>;
