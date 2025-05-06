import axios from '@/services/axiosInstance';
import { InstructorProfileResponseModel, UpdateInstructorProfileModel } from '../models/instructor.model';

/**
 * 取得講師個人資料
 * 
 * @returns API 回傳的講師個人資料
 */
export const fetchInstructorProfile = async (): Promise<InstructorProfileResponseModel> => {
  /** 權限 token */
  const token = localStorage.getItem('token');
  
  try {
    const response = await axios.get('/api/v1/instructor/me', {
      headers: {
        Authorization: token,
      },
    });

    return {
      status: 'success',
      message: '取得講師資料成功',
      data: response.data
    };
  } catch (error: any) {
    console.error('API error:', error.response?.data || error.message);
    return {
      status: 'error',
      message: error.response?.data?.message || '無法取得講師資料，請稍後再試。',
      data: undefined
    };
  }
};

/**
 * 更新講師個人資料
 * 
 * @param data - 欲更新的講師個人資料
 * @returns API 回傳的更新結果
 */
export const updateInstructorProfile = async (data: UpdateInstructorProfileModel): Promise<InstructorProfileResponseModel> => {
  /** 權限 token */
  const token = localStorage.getItem('token');
  
  try {
    console.log("Update Profile Data:", data);
    const response = await axios.put('/api/v1/instructor/me', data, {
      headers: {
        Authorization: token,
      },
    });
    console.log("Update Profile Response:", response);
    return {
      status: 'success',
      message: '更新講師資料成功',
      data: response.data
    };
  } catch (error: any) {
    console.error("Update Profile Error:", error.response?.data || error.message);
    return {
      status: 'error',
      message: error.response?.data?.message || '無法更新講師資料，請稍後再試。',
      data: undefined
    };
  }
}; 