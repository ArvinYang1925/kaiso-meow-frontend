import axios from '@/services/axiosInstance'; //很重要，這邊必須確認呼叫到的是 axiosInstance!!
import { LogoutResponseData } from '@/services/types';

export const logoutUser = () => {
    return axios.post<LogoutResponseData>('/api/v1/auth/logout');
};
