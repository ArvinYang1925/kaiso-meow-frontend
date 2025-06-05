import axios from "@/services/axiosInstance";

interface Course {
  id: string;
  title: string;
}

interface ApiResponse<T> {
  status: "success" | "failed";
  message: string;
  data: T;
}

/**
 * 根據課程 ID 獲取課程詳細資訊 (API#34 )
 *
 */
export const getCourseById = async (courseId: string): Promise<Course> => {
  try {
    const response = await axios.get<ApiResponse<Course>>(
      `/api/v1/instructor/courses/${courseId}`
    );

    // 檢查 API 回應狀態
    if (response.data.status !== "success") {
      throw new Error(response.data.message || "獲取課程資訊失敗");
    }

    // 返回實際的課程資料
    return response.data.data;
  } catch (error) {
    console.error("獲取課程資訊時發生錯誤:", error);
    throw error;
  }
};
