import axiosInstance from '@/services/axiosInstance';
import { ChangePasswordRequestModel } from '../models/password.model';
import { ApiResponseModel } from '../models/api.model';

/**
 * 變更密碼
 * 
 * @param data - 密碼變更資料
 * @returns API 回傳的結果
 */
export const changePassword = async (data: ChangePasswordRequestModel): Promise<ApiResponseModel> => {
  /** 權限 token */
  const token = localStorage.getItem('token');
  
  return axiosInstance.put('/api/v1/auth/password', data, {
    headers: {
      Authorization: token,
    },
  });
};

// DEMO 模式相關設定
const DEMO_MODE = process.env.NODE_ENV === 'development';

// DEMO 使用者資料
const DEMO_USER = {
  email: 'program_meow@meow.com',
  currentPassword: 'CCdd1111',
  newPassword: 'NewCCdd1111'
};

/**
 * DEMO 模式的變更密碼功能
 * 
 * @param data - 密碼變更資料
 * @returns 模擬的 API 回應
 */
export const changePasswordDemo = async (data: ChangePasswordRequestModel): Promise<ApiResponseModel> => {
  // 模擬 API 調用延遲
  await new Promise(resolve => setTimeout(resolve, 1000));

  // 驗證當前密碼
  if (data.currentPassword !== DEMO_USER.currentPassword) {
    throw new Error('原始密碼錯誤');
  }

  // 更新 demo 資料中的密碼
  DEMO_USER.currentPassword = data.newPassword;

  // 模擬成功的情況
  console.log('密碼變更成功！');
  console.log('舊密碼:', data.currentPassword);
  console.log('新密碼:', data.newPassword);

  return {
    status: 'success',
    message: '密碼變更成功',
  };
};

/**
 * 根據環境選擇合適的密碼變更功能
 */
export const getPasswordService = () => {
  return DEMO_MODE ? changePasswordDemo : changePassword;
};




// import { PasswordFormValues } from './PasswordStore';

// // Demo 資料
// const DEMO_USER = {
//   email: 'program_meow@meow.com',
//   currentPassword: 'CCdd1111',
//   newPassword: 'NewCCdd1111'
// };

// export class PasswordService {
//   static async changePassword(data: PasswordFormValues): Promise<void> {
//     // 模擬 API 調用延遲
//     await new Promise(resolve => setTimeout(resolve, 1000));

//     // 驗證當前密碼
//     if (data.currentPassword !== DEMO_USER.currentPassword) {
//       throw new Error('原始密碼錯誤');
//     }

//     // 驗證新密碼是否符合規則
//     if (data.newPassword.length < 8) {
//       throw new Error('新密碼長度至少為 8 個字符');
//     }

//     if (!/[A-Z]/.test(data.newPassword)) {
//       throw new Error('新密碼必須包含至少一個大寫字母');
//     }

//     if (!/[a-z]/.test(data.newPassword)) {
//       throw new Error('新密碼必須包含至少一個小寫字母');
//     }

//     if (!/[0-9]/.test(data.newPassword)) {
//       throw new Error('新密碼必須包含至少一個數字');
//     }

//     // 驗證新密碼和確認密碼是否一致
//     if (data.newPassword !== data.confirmPassword) {
//       throw new Error('兩次輸入的密碼不一致');
//     }

//     // 模擬成功的情況
//     console.log('密碼變更成功！');
//     console.log('舊密碼:', DEMO_USER.currentPassword);
//     console.log('新密碼:', data.newPassword);

//     // 更新 demo 資料中的密碼
//     DEMO_USER.currentPassword = data.newPassword;
//   }
// } 