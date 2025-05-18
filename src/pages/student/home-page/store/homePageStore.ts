import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import axios from 'axios';
import { createNewsletter, fetchCourseCardList, NewsletterFormData } from '../services/home-page.service';
import { CourseItem, CourseListResponse } from '../services/types'
import { BaseApiResponseModel } from '@/services/types';
import { courseCardList } from '../data/courseCardData';
interface HomePageState {
    courseCardList: CourseItem[];
}
interface HomePageAction {
    fetchCourseCardList: () => Promise<CourseListResponse | BaseApiResponseModel>;
    createNewsletter: (formData: NewsletterFormData) => Promise<BaseApiResponseModel | { status: number, message: string }>
}

export const useHomePageStore = create<HomePageState & HomePageAction>()(
    immer((set) => ({
        courseCardList: courseCardList,
        fetchCourseCardList: async () => {
            try {
                const response = await fetchCourseCardList(1, 9);
                set((state) => {
                    state.courseCardList = response.data.courseList
                });
                return response
            } catch (error) {
                console.log(error)
                return {
                    status: 'failed',
                    message: '訂閱失敗，請稍後再試',
                };
            }
        },
        createNewsletter: async (formData) => {
            try {
                const response = await createNewsletter(formData);
                return response
            } catch (error) {
                console.log('error', error)
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
