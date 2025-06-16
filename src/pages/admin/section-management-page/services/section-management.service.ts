import axios from "@/services/axiosInstance"; //很重要，這邊必須確認呼叫到的是 axiosInstance!!
import { Section, CreateSectionRequestModel, UpdateSectionRequestModel, UpdateSectionPublishedStatusRequestModel, SectionOrder, Video, VideoStatus, CreateAiSectionDraftRequestModel, AiSectionDraftResponse } from './type'
import { BaseApiResponseModel } from "@/services/types";

/** 查詢某課程的所有章節列表 */
export const fetchSectionList = async (
    courseId: string
): Promise<Section[]> => {
    const response = await axios.get(`/api/v1/instructor/courses/${courseId}/sections`);
    return response.data.data;
};

/** 新增章節 */
export const createSection = async (courseId: string,
    data: CreateSectionRequestModel
): Promise<Section> => {
    const response = await axios.post(`/api/v1/instructor/courses/${courseId}/sections`, data);
    return response.data.data;
};

/** 更新章節 */
export const updateSection = async (sectionId: string,
    data: UpdateSectionRequestModel
): Promise<Section> => {
    const response = await axios.patch(`/api/v1/instructor/sections/${sectionId}/`, data);
    return response.data.data;
};

/** 刪除章節 */
export const deleteSection = async (
    sectionId: string
): Promise<BaseApiResponseModel> => {
    const response = await axios.delete(`/api/v1/instructor/sections/${sectionId}/`);
    return response.data.data;
};

/** 發佈/取消發佈章節 */
export const updateSectionPublishedStatus = async (sectionId: string,
    data: UpdateSectionPublishedStatusRequestModel
): Promise<Section> => {
    const response = await axios.patch(`/api/v1/instructor/sections/${sectionId}/publish`, data);
    return response.data.data;
};

/** 更新章節順序 */
export const updateSectionOrder = async (courseId: string, newSectionOrderList: SectionOrder[]): Promise<Section[]> => {
    const response = await axios.put(`/api/v1/instructor/courses/${courseId}/sections/sort`, { sections: newSectionOrderList });
    return response.data.data;
};

/** 批次新增章節 */
export const batchCreateSection = async (courseId: string, sections: CreateSectionRequestModel[]): Promise<Section[]> => {
    const response = await axios.post(`/api/v1/instructor/courses/${courseId}/sections/batch`, { sections });
    return response.data.data;
};

/** AI 章節草稿產生 */
export const createAiSectionsDraft = async (courseId: string, data: CreateAiSectionDraftRequestModel): Promise<AiSectionDraftResponse> => {
    const response = await axios.post(`/api/v1/instructor/courses/${courseId}/ai-generated-sections`, data);
    return response.data.data;
};

/** 上傳影片 (檔案) */
export const createVideo = async (sectionId: string, file: File): Promise<Video> => {
    const response = await axios.post(`/api/v1/instructor/sections/${sectionId}/video`, file);
    return response.data.data;
}

/** 刪除影片 (檔案) */
export const deleteVideo = async (sectionId: string): Promise<Section> => {
    const response = await axios.delete(`/api/v1/instructor/sections/${sectionId}/video`);
    return response.data.data;
}

/** 查詢轉檔狀態 */
export const fetchVideoStatus = async (sectionId: string): Promise<VideoStatus> => {
    const response = await axios.get(`/api/v1/instructor/sections/${sectionId}/video/status`);
    return response.data.data;
}

