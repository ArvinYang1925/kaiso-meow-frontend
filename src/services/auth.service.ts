import axios from '@/services/axiosInstance'; //很重要，這邊必須確認呼叫到的是 axiosInstance!!
import { LogoutResponseData, LoginFormData, RegisterUserModel } from '@/services/types';

/** 使用者登入 API */
export const loginUser = (data: LoginFormData) => {
    return axios.post('/api/v1/auth/login', data);
};

/** 使用者登出 API */
export const logoutUser = () => {
    return axios.post<LogoutResponseData>('/api/v1/auth/logout');
};

/** 使用者註冊 API */
export const registerUser = (data: RegisterUserModel) => {
    return axios.post('/api/v1/auth/register', data);
};

