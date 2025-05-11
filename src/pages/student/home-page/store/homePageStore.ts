import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { createNewsletter, NewsletterFormData } from '../services/home-page.service';
import { BaseApiResponseModel } from '@/services/types';

interface HomePageState {
    courseCardList: Array<{
        id: number;
        title: string;
    }>;
}
interface HomePageAction {
    fetchCourseCardList: () => Promise<void>;
    createNewsletter: (formData: NewsletterFormData) => Promise<BaseApiResponseModel>;
}

export const useHomePageStore = create<HomePageState & HomePageAction>()(
    immer((set) => ({
        courseCardList: [],
        fetchCourseCardList: async () => {
            set((state) => {
                state.courseCardList = []
            });
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
