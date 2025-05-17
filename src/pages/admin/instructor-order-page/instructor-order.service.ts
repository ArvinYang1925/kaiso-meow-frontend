import axios from "@/services/axiosInstance"; //很重要，這邊必須確認呼叫到的是 axiosInstance!!
import { InstructorOrder } from "./types";
import { Pagination } from "@/services/types";

export type InstructorOrderListResponse = {
  orderList: InstructorOrder[];
  pagination: Pagination;
};

export const fetchInstructorOrderList = async (
  page: number,
  pageSize: number
): Promise<InstructorOrderListResponse> => {
  const response = await axios.get("/api/v1/instructor/orders", {
    params: { page, pageSize },
  });
  return response.data.data;
};
