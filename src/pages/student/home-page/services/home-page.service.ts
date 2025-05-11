import axios from '@/services/axiosInstance'; //很重要，這邊必須確認呼叫到的是 axiosInstance!!
import { BaseApiResponseModel } from '@/services/types';

export type NewsletterFormData = {
    email: string;
    name: string;
}

export const fetchCourseCardList = async () => {
    const response = await axios.get('/api/v1/auth/profile');
    return response.data;
};

export const createNewsletter = async (formData: NewsletterFormData): Promise<BaseApiResponseModel> => {
    const response = await axios.post<BaseApiResponseModel>('/api/v1/newsletter/subscribe', formData);
    return response.data;
};