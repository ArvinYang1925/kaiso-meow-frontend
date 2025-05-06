/**
 * 密碼表單資料模型
 */
export type PasswordFormValues = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

/**
 * 變更密碼請求模型
 */
export type ChangePasswordRequestModel = {
  currentPassword: string;
  newPassword: string;
};
