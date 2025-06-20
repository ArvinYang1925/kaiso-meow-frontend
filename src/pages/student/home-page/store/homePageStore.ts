import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import axios from 'axios';
import { createNewsletter, fetchCourseCardList, NewsletterFormData } from '../services/home-page.service';
import { CourseItem, CourseListResponse } from '../services/types'
import { BaseApiResponseModel } from '@/services/types';
interface HomePageState {
    courseCardList: CourseItem[];
    isLoading: boolean;
}
interface HomePageAction {
    fetchCourseCardList: () => Promise<CourseListResponse | BaseApiResponseModel>;
    createNewsletter: (formData: NewsletterFormData) => Promise<BaseApiResponseModel | { status: number, message: string }>
}

export const useHomePageStore = create<HomePageState & HomePageAction>()(
    immer((set) => ({
        courseCardList: [],
        isLoading: false,
        fetchCourseCardList: async () => {
            try {
                set(state => { state.isLoading = true; });
                const response = await fetchCourseCardList(1, 9);
                set((state) => {
                    state.courseCardList = response.data.courseList;
                    state.isLoading = false;
                });
                return response;
            } catch (error) {
                console.log(error);
                set(state => { state.isLoading = false; });
                return {
                    status: 'failed',
                    message: '請稍後再試',
                };
            }
        },
        createNewsletter: async (formData) => {
            try {
                const response = await createNewsletter(formData);
                return response;
            } catch (error) {
                console.log('error', error);
                let status = 500;
                let message = 'Unknown error';

                if (axios.isAxiosError(error)) {
                    status = error.response?.status ? error.response.status : 500;
                    message = error.response?.data?.message ? error.response.data.message : 'Unknown error in homePageStore';
                }

                return {
                    status: status,
                    message: message,
                };
            }


        }
    }))
);
