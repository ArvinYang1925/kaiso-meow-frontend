import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { fetchSectionList, createSection, updateSection, deleteSection, updateSectionPublishedStatus } from "../services/section-management.service";
import { CreateSectionRequestModel, Section, UpdateSectionPublishedStatusRequestModel, UpdateSectionRequestModel } from "../services/type";

interface SectionManagementState {
    sectionList: Section[];
    section: Section;
    isLoading: boolean;
    error: string | null;
}

interface SectionManagementAction {
    fetchSectionList: (courseId: string) => Promise<void>;
    createSection: (sectionId: string, data: CreateSectionRequestModel) => Promise<void>;
    updateSection: (sectionId: string, data: UpdateSectionRequestModel) => Promise<void>;
    deleteSection: (sectionId: string) => Promise<void>;
    updateSectionPublishedStatus: (sectionId: string, data: UpdateSectionPublishedStatusRequestModel) => Promise<void>;
    setSectionList: (newSectionList: Section[]) => void;
}

export const useSectionManagementStore = create<SectionManagementState & SectionManagementAction>()(
    immer((set) => ({
        sectionList: [
            {
                id: "section_1",
                title: "第一章：課程介紹",
                videoUrl: 'http: test-video.com',
                content: "本章節介紹課程的基本內容",
                isPublished: false
            },
            {
                id: "section_2",
                title: "第二章：課程介紹",
                videoUrl: 'http: test-video.com',
                content: "本章節介紹課程的基本內容",
                isPublished: false
            },
            {
                id: "section_3",
                title: "第三章：課程介紹",
                videoUrl: 'http: test-video.com',
                content: "本章節介紹課程的基本內容",
                isPublished: false
            },
            {
                id: "section_4",
                title: "第四章：課程介紹",
                videoUrl: 'http: test-video.com',
                content: "本章節介紹課程的基本內容",
                isPublished: false
            },
        ],
        section: {
            id: '',
            title: '',
            videoUrl: '',
            content: '',
            isPublished: false
        },
        isLoading: false,
        error: null,

        setSectionList: (newSectionList) => {
            set((state) => {
                state.sectionList = newSectionList
            });
        },

        fetchSectionList: async (courseId) => {
            set((state) => {
                state.isLoading = true;
                state.error = null;
            });
            try {
                const data = await fetchSectionList(courseId);
                set((state) => {
                    state.sectionList = data;
                    state.isLoading = false;
                });
            } catch (error: any) {
                set((state) => {
                    state.error = error?.message || '取得章節資料失敗';
                    state.isLoading = false;
                });
            }
        },
        createSection: async (sectionId, reqData) => {
            set((state) => {
                state.isLoading = true;
                state.error = null;
            });
            try {
                const data = await createSection(sectionId, reqData);
                set((state) => {
                    state.section = data;
                    state.isLoading = false;
                });
            } catch (error: any) {
                set((state) => {
                    state.error = error?.message || '新增章節資料失敗';
                    state.isLoading = false;
                });
            }
        },
        updateSection: async (sectionId, reqData) => {
            set((state) => {
                state.isLoading = true;
                state.error = null;
            });
            try {
                const data = await updateSection(sectionId, reqData);
                set((state) => {
                    state.section = data;
                    state.isLoading = false;
                });
            } catch (error: any) {
                set((state) => {
                    state.error = error?.message || '更新章節資料失敗';
                    state.isLoading = false;
                });
            }
        },
        deleteSection: async (sectionId) => {
            set((state) => {
                state.isLoading = true;
                state.error = null;
            });
            try {
                const data = await deleteSection(sectionId);
                console.log('delete res in store', data)
                set((state) => {
                    // state.section = data;
                    state.isLoading = false;
                });
            } catch (error: any) {
                set((state) => {
                    state.error = error?.message || '刪除章節資料失敗';
                    state.isLoading = false;
                });
            }
        },
        updateSectionPublishedStatus: async (sectionId, reqData) => {
            set((state) => {
                state.isLoading = true;
                state.error = null;
            });
            try {
                const data = await updateSectionPublishedStatus(sectionId, reqData);
                console.log('update status res in store', data)
                set((state) => {
                    state.section = data;
                    state.isLoading = false;
                });
            } catch (error: any) {
                set((state) => {
                    state.error = error?.message || '更新章節順序失敗';
                    state.isLoading = false;
                });
            }
        }


    }))
)