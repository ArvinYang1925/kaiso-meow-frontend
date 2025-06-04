import axios from 'axios';

interface Course {
  id: string;
  title: string;
}

/**
 * 根據課程 ID 獲取課程詳細資訊
 */
export const getCourseById = async (courseId: string): Promise<Course> => {
  const response = await axios.get(`/api/v1/instructor/courses/${courseId}`);
  return response.data;
};
