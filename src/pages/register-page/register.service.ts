import axios from '@/services/axiosInstance'; //很重要，這邊必須確認呼叫到的是 axiosInstance!!

/** 使用者註冊 */
type RegisterUserDataModel = {
    name: string;
    email: string;
    password: string;
}

export const registerUser = (data: RegisterUserDataModel) => {
    return axios.post('/api/v1/auth/register', data);
};

