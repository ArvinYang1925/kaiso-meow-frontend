import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import {
  fetchSectionList,
  createSection,
  updateSection,
  deleteSection,
  updateSectionPublishedStatus,
  updateSectionOrder,
  // createVideo,
  deleteVideo,
  fetchVideoStatus
} from "../services/section-management.service";
import {
  CreateSectionRequestModel,
  Section,
  SectionOrder,
  UpdateSectionPublishedStatusRequestModel,
  UpdateSectionRequestModel,
  Video,
  VideoStatus,
} from "../services/type";
import axios from "axios";

interface SectionManagementState {
  sectionList: Section[];
  section: Section;
  video: Video;
  videoStatus: VideoStatus;
  videoFileName: string;
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
  createVideo: (sectionId: string, file: File) => Promise<void>;
  deleteVideo: (sectionId: string) => Promise<void>;
  fetchVideoStatus: (sectionId: string) => Promise<VideoStatus>;
  setSectionList: (newSectionList: Section[]) => void;
  setCurrentSection: (currentSection: Section) => void;
  setIsShowCreateSectionModal: (isShowModal: boolean) => void;
  setIsShowUpdateSectionModal: (isShowModal: boolean) => void;
  setIsShowUploadVideoModal: (isShowModal: boolean) => void;
  setIsShowEditVideoModal: (isShowModal: boolean) => void;
  setVideoFileName: (fileName: string) => void;
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
    video: {
      id: '',
      title: '',
      uploadStatus: ''
    },
    videoStatus: {
      uploadStatus: 'no_video',
      videoUrl: null,
      errorType: undefined
    },
    videoFileName: '',
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
        });
      } catch (error: any) {
        console.log('error in section order', error)
        throw error;
      } finally {
        set((state) => {
          state.isLoading = false;
        });
      }
    },
    createVideo: async (sectionId, file) => {
      set((state) => {
        state.isLoading = true;
      });
      try {
        const formData = new FormData();
        formData.append("file", file); // key 要和後端預期的對應

        const token = localStorage.getItem("token"); // 或從其他地方取得
        const response = await axios.post(`/api/v1/instructor/sections/${sectionId}/video`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data", // axios 會自動補上 boundary
              Authorization: `Bearer ${token}`,
            },
          })
        console.log('in store create video', response.data.data)
        set((state) => {
          state.video = response.data.data;
        });
      } catch (error) {
        console.log('error in createVideo', error)
        throw error;
      } finally {
        set((state) => {
          state.isLoading = false;
        });
      }
    },
    deleteVideo: async (sectionId) => {
      set((state) => {
        state.isLoading = true;
      });
      try {
        const data = await deleteVideo(sectionId)
        set((state) => {
          state.section = data; //turn videoUrl into null
          state.isLoading = false;
        });
      } catch (error) {
        console.log('error in deleteVideo', error)
        throw error;
      }
    },
    fetchVideoStatus: async (sectionId) => {
      set((state) => {
        state.isLoading = true;
      });
      try {
        const data = await fetchVideoStatus(sectionId)
        return data
      } catch (error) {
        console.log('error in fetchVideoStatus', error)
        throw error;
      } finally {
        set((state) => {
          state.isLoading = false;
        });
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
    setVideoFileName: (fileName) => {
      set((state) => {
        state.videoFileName = fileName;
      });
    },
  }))
);
