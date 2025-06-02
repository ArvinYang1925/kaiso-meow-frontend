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