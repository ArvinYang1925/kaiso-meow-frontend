import axios from '@/services/axiosInstance'; //很重要，這邊必須確認呼叫到的是 axiosInstance!!
import { ApiResponseModel } from "@/services/types";

export type ResetPasswordModel = {
    token: string;
    newPassword: string;
};

export const resetPassword = async (data: ResetPasswordModel): Promise<ApiResponseModel> => {
    const response = await axios.post<ApiResponseModel>('/api/v1/auth/password/reset', data);
    return response.data;
};