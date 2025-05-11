import axios from '@/services/axiosInstance'; //很重要，這邊必須確認呼叫到的是 axiosInstance!!
import { BaseApiResponseModel } from "@/services/types";

export type ResetPasswordModel = {
    token: string;
    newPassword: string;
};

export const resetPassword = async (data: ResetPasswordModel): Promise<BaseApiResponseModel> => {
    const response = await axios.post<BaseApiResponseModel>('/api/v1/auth/password/reset', data);
    return response.data;
};