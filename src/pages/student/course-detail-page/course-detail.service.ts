import axios from "@/services/axiosInstance"; //很重要，這邊必須確認呼叫到的是 axiosInstance!!

type Instructor = {
  id: string;
  name: string;
  profileUrl: string;
};

export type Section = {
  id: string;
  title: string;
  content: string;
  orderIndex: number;
};

export type CourseDetailResponse = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  highlight: string;
  duration: number;
  isPublished: boolean;
  price: number;
  isFree: boolean;
  coverUrl: string;
  instructor: Instructor;
  sections: Section[];
  isPurchased: boolean;
};

export const fetchCourseDetail = async (
  courseId: string
): Promise<CourseDetailResponse> => {
  const response = await axios.get(`/api/v1/courses/${courseId}`);
  return response.data.data;
};
