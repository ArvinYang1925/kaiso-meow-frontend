import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import {
    CourseDetailResponse
    // , fetchCourseDetail 
} from './course-detail.service'
import { mockCourseDetail } from './mockData';

interface CourseDetailState {
    courseDetail: CourseDetailResponse | null;
    isLoading: boolean;
    error: string | null;
}

interface CourseDetailAction {
    fetchCourseDetailById: (courseId: string) => Promise<void>;
    clearCourseDetail: () => void;
}

export const useCourseDetailStore = create<CourseDetailState & CourseDetailAction>()(
    immer((set) => ({
        courseDetail: mockCourseDetail,
        isLoading: false,
        error: null,

        fetchCourseDetailById: async (
            // courseId: string
        ) => {
            set((state) => {
                state.isLoading = true;
                state.error = null;
            });
            try {
                // const data = await fetchCourseDetail(courseId);
                set((state) => {
                    //   state.courseDetail = data;
                    state.isLoading = false;
                });
            } catch (error: any) {
                set((state) => {
                    state.error = error?.message || '取得課程資料失敗';
                    state.isLoading = false;
                });
            }
        },

        clearCourseDetail: () => {
            set((state) => {
                state.courseDetail = null;
                state.error = null;
                state.isLoading = false;
            });
        },
    }))
);
