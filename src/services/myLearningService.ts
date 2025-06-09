import axios from "./axiosInstance";
import { MyLearningApiResponse } from "@/types/course";

export const myLearningService = {
  getMyLearningCourses: async (
    page = 1,
    pageSize = 9
  ): Promise<MyLearningApiResponse> => {
    const response = await axios.get<MyLearningApiResponse>(
      "/api/v1/courses/my-learning",
      {
        params: { page, pageSize },
      }
    );
    return response.data;
  },
};
