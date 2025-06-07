/** 章節列表資料 */
export type Section = {
    id: string;
    title: string;
    videoUrl: string;
    content: string;
    isPublished: boolean;
}

/** 新增章節 - 請求資料 */
export type CreateSectionRequestModel = {
    title: string;
    content: string;
}

/** 編輯章節 - 請求資料 */
export type UpdateSectionRequestModel = {
    title: string;
    content: string;
}

/** 發佈/取消發佈章節 - 請求資料 */
export type UpdateSectionPublishedStatusRequestModel = {
    isPublished: boolean;
}

/** 更新章節順序 - 請求資料 */
export type SectionOrder = {
    id: string;
    order: number;
};

/** AI 章節草稿產生 - 請求資料 */
export type CreateAiSectionDraftRequestModel = {
    sectionIdea?: string;
    description: string;
    expectedSectionCount?: number;
}


/** 上傳影片 - 回應資料 */
export type Video = {
    id: string;
    title: string;
    uploadStatus: string;
}

/** 查詢轉檔狀態 - 回應資料 */
export type VideoStatus = {
    uploadStatus: "no_video" | "pending" | "processing" | "completed" | "failed";
    videoUrl: null | string;
    errorType?: "transcode" | "upload" | "unknown";
}