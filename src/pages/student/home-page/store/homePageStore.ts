import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
// import { fetchCourseCardList } from '../services/home-page.service';

interface HomePageState {
    courseCardList: Array<{
        id: number;
        title: string;
    }>;
}

interface HomePageAction {
    fetchCourseCardList: () => Promise<void>;
}

export const useProfileStore = create<HomePageState & HomePageAction>()(
    immer((set) => ({
        courseCardList: [],
        fetchCourseCardList: async () => {
            set((state) => {
                state.courseCardList = []
            });
        }
    }))
);
