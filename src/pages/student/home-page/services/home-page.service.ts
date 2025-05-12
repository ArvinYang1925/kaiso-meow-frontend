import axios from '@/services/axiosInstance'; //很重要，這邊必須確認呼叫到的是 axiosInstance!!
import { BaseApiResponseModel } from '@/services/types';
import { CourseListResponse } from './types';

export type NewsletterFormData = {
    email: string;
    name: string;
}

export const fetchCourseCardList = async (
    page = 1,
    pageSize = 9
  ): Promise<CourseListResponse> => {
    const response = await axios.get<CourseListResponse>('/api/v1/courses', {
      params: { page, pageSize },
    });
    return response.data;
  };

export const createNewsletter = async (formData: NewsletterFormData): Promise<BaseApiResponseModel> => {
    const response = await axios.post<BaseApiResponseModel>('/api/v1/newsletter/subscribe', formData);
    return response.data;
};