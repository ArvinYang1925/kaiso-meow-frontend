import axios from '@/services/axiosInstance'; //很重要，這邊必須確認呼叫到的是 axiosInstance!!

/** 使用者登入 */
type LoginUserDataModel = {
    email: string;
    password: string;
}

export const loginUser = (data: LoginUserDataModel) => {
    return axios.post('/api/v1/auth/login', data);
};
