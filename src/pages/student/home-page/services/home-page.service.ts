import axios from '@/services/axiosInstance'; //很重要，這邊必須確認呼叫到的是 axiosInstance!!

export const fetchCourseCardList = async () => {
    const response = await axios.get('/api/v1/auth/profile');
    return response.data;
};