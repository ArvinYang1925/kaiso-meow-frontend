import axios from '@/services/axiosInstance'; //很重要，這邊必須確認呼叫到的是 axiosInstance!!
import { LogoutResponseData, LoginFormData, RegisterFormData, PasswordForgotFormData, ApiResponseModel } from '@/services/types';

/** 使用者登入 API */
export const loginUser = (data: LoginFormData) => {
    return axios.post('/api/v1/auth/login', data);
};

/** 使用者登出 API */
export const logoutUser = () => {
    return axios.post<LogoutResponseData>('/api/v1/auth/logout');
};

/** 使用者註冊 API */
export const registerUser = (data: RegisterFormData) => {
    return axios.post('/api/v1/auth/register', data);
};

/** 忘記密碼-發送重設密碼信件 API */
export const sendPasswordForgotLetter = async (data: PasswordForgotFormData): Promise<ApiResponseModel> => {
    const response = await axios.post<ApiResponseModel>('/api/v1/auth/password/forgot', data);
    return response.data;
};
