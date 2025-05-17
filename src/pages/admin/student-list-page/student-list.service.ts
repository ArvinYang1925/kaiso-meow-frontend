import axios from "@/services/axiosInstance"; //很重要，這邊必須確認呼叫到的是 axiosInstance!!
import { Student } from "./types";
import { Pagination } from "@/services/types";

export type StudentListResponse = {
  studentList: Student[];
  pagination: Pagination;
};

export const fetchStudentList = async (
  page: number,
  pageSize: number
): Promise<StudentListResponse> => {
  const response = await axios.get("/api/v1/instructor/students", {
    params: { page, pageSize },
  });
  return response.data.data;
};
