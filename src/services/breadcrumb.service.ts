import axios from "@/services/axiosInstance";
import { ApiResponseModel } from "@/pages/admin/models/api.model";

interface Course {
  id: string;
  title: string;
}

/**
 * 根據課程 ID 獲取課程詳細資訊 (API#34)
 */
export const getCourseById = async (courseId: string): Promise<Course> => {
  const response = await axios.get<ApiResponseModel<Course>>(
    `/api/v1/instructor/courses/${courseId}`
  );

  if (response.data.status !== "success") {
    throw new Error(response.data.message || "獲取課程資訊失敗");
  }

  if (!response.data.data) {
    throw new Error("課程資料不存在");
  }

  return response.data.data;
};
