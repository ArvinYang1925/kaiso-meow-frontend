import axios from "@/services/axiosInstance"; //很重要，這邊必須確認呼叫到的是 axiosInstance!!
import { BaseApiResponseModel } from "@/services/types";
import { CourseListResponse } from "./types";

export type NewsletterFormData = {
  email: string;
  name: string;
};

export const fetchCourseCardList = async (
  page = 1,
  pageSize = 9,
  search?: string
): Promise<CourseListResponse> => {
  const response = await axios.get<CourseListResponse>("/api/v1/courses", {
    params: { page, pageSize, search },
  });
  return response.data;
};

export const createNewsletter = async (
  formData: NewsletterFormData
): Promise<BaseApiResponseModel> => {
  const response = await axios.post<BaseApiResponseModel>(
    "/api/v1/newsletter/subscribe",
    formData
  );
  return response.data;
};

// 創建穩定的廣告配置，避免每次呼叫都創建新物件
const AD_CONFIGS = [
  {
    id: "topMarquee",
    storageKey: "homeMarqueeAdClosed",
    onlyHomePage: true,
    showDelay: 500,
    priority: 1, // 最高優先級，第一個顯示
  },
  {
    id: "popupAd",
    storageKey: "homeDialogAdShown",
    onlyHomePage: true,
    showDelay: 2000,
    priority: 2, // 第二個顯示
  },
  {
    id: "bottomMarquee",
    storageKey: "bottomMarqueeAdClosed",
    onlyHomePage: false,
    showDelay: 5000,
    priority: 3, // 最後顯示
  },
];

export const getAdConfigs = () => {
  return AD_CONFIGS;
};
