import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { createNewsletter, fetchCourseCardList, NewsletterFormData } from '../services/home-page.service';
import { CourseItem, CourseListResponse } from '../services/types'
import { BaseApiResponseModel } from '@/services/types';
import { courseCardList } from '../data/courseCardData';

interface HomePageState {
    courseCardList: CourseItem[];
}
interface HomePageAction {
    fetchCourseCardList: () => Promise<CourseListResponse | BaseApiResponseModel>;
    createNewsletter: (formData: NewsletterFormData) => Promise<BaseApiResponseModel>;
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

                return {
                    status: 'failed',
                    message: '訂閱失敗，請稍後再試',
                };
            }


        }
    }))
);
