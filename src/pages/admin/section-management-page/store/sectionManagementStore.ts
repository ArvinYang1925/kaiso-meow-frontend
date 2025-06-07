import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import {
  fetchSectionList,
  createSection,
  updateSection,
  deleteSection,
  updateSectionPublishedStatus,
  updateSectionOrder,
} from "../services/section-management.service";
import {
  CreateSectionRequestModel,
  Section,
  SectionOrder,
  UpdateSectionPublishedStatusRequestModel,
  UpdateSectionRequestModel,
} from "../services/type";

interface SectionManagementState {
  sectionList: Section[];
  section: Section;
  isLoading: boolean;
  isShowCreateSectionModal: boolean;
  isShowUpdateSectionModal: boolean;
  isShowUploadVideoModal: boolean;
  isShowEditVideoModal: boolean;
}

interface SectionManagementAction {
  fetchSectionList: (courseId: string) => Promise<void>;
  createSection: (
    sectionId: string,
    data: CreateSectionRequestModel
  ) => Promise<void>;
  updateSection: (
    sectionId: string,
    data: UpdateSectionRequestModel
  ) => Promise<void>;
  deleteSection: (sectionId: string) => Promise<void>;
  updateSectionPublishedStatus: (
    sectionId: string,
    data: UpdateSectionPublishedStatusRequestModel
  ) => Promise<void>;
  updateSectionOrder: (courseId: string, newSectionOrderList: SectionOrder[]) => Promise<void>;
  setSectionList: (newSectionList: Section[]) => void;
  setCurrentSection: (currentSection: Section) => void;
  setIsShowCreateSectionModal: (isShowModal: boolean) => void;
  setIsShowUpdateSectionModal: (isShowModal: boolean) => void;
  setIsShowUploadVideoModal: (isShowModal: boolean) => void;
  setIsShowEditVideoModal: (isShowModal: boolean) => void;
}

export const useSectionManagementStore = create<
  SectionManagementState & SectionManagementAction
>()(
  immer((set) => ({
    sectionList: [],
    section: {
      id: "",
      title: "",
      videoUrl: "",
      content: "",
      isPublished: false,
    },
    isLoading: false,
    isShowCreateSectionModal: false,
    isShowUpdateSectionModal: false,
    isShowUploadVideoModal: false,
    isShowEditVideoModal: false,

    setSectionList: (newSectionList) => {
      set((state) => {
        state.sectionList = newSectionList;
      });
    },

    fetchSectionList: async (courseId) => {
      set((state) => {
        state.isLoading = true;
      });
      try {
        const data = await fetchSectionList(courseId);
        set((state) => {
          state.sectionList = data;
          state.isLoading = false;
        });
      } catch (error: any) {
        console.error("Failed to fetch section list", error.response.data);
        throw error;
      }
    },
    createSection: async (sectionId, reqData) => {
      set((state) => {
        state.isLoading = true;
      });
      try {
        const data = await createSection(sectionId, reqData);
        set((state) => {
          state.section = data;
          state.isLoading = false;
        });
      } catch (error: any) {
        console.error("Failed to create section", error.response.data);
        throw error;
      }
    },
    updateSection: async (sectionId, reqData) => {
      set((state) => {
        state.isLoading = true;
      });
      try {
        const data = await updateSection(sectionId, reqData);
        set((state) => {
          state.section = data;
          state.isLoading = false;
        });
      } catch (error: any) {
        console.error("Failed to update section", error.response.data);
        throw error;
      }
    },
    deleteSection: async (sectionId) => {
      set((state) => {
        state.isLoading = true;
      });
      try {
        const data = await deleteSection(sectionId);
        console.log("delete res in store", data);
      } catch (error: any) {
        console.error("Failed to delete section", error.response.data);
        throw error;
      } finally {
        set((state) => {
          state.isLoading = false;
        });
      }
    },
    updateSectionPublishedStatus: async (sectionId, reqData) => {
      set((state) => {
        state.isLoading = true;
      });
      try {
        const data = await updateSectionPublishedStatus(sectionId, reqData);
        console.log("update status res in store", data);
        set((state) => {
          state.section = data;
          state.isLoading = false;
        });
      } catch (error: any) {
        console.log('error in update section status', error)
        throw error;
      }
    },
    updateSectionOrder: async (courseId, newSectionOrderList) => {
      set((state) => {
        state.isLoading = true;
      });
      try {
        const data = await updateSectionOrder(courseId, newSectionOrderList);
        console.log("update section order in store", data);
        set((state) => {
          state.sectionList = data;
          state.isLoading = false;
        });
      } catch (error: any) {
        console.log('error in section order', error)
        throw error;
      }
    },
    setIsShowCreateSectionModal: (isShowCreateModal) => {
      set((state) => {
        state.isShowCreateSectionModal = isShowCreateModal;
      });
    },
    setIsShowUpdateSectionModal: (isShowUpdateModal) => {
      set((state) => {
        state.isShowUpdateSectionModal = isShowUpdateModal;
      });
    },
    setIsShowUploadVideoModal: (isShowModal) => {
      set((state) => {
        state.isShowUploadVideoModal = isShowModal;
      });
    },
    setIsShowEditVideoModal: (isShowModal) => {
      set((state) => {
        state.isShowEditVideoModal = isShowModal;
      });
    },
    setCurrentSection: (currentSection) => {
      set((state) => {
        state.section = currentSection;
      });
    },
  }))
);
