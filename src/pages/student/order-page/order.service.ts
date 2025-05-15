import axios from "@/services/axiosInstance"; //很重要，這邊必須確認呼叫到的是 axiosInstance!!
import { Order } from "./types";
import { Pagination } from "@/services/types";

export type OrderListResponse = {
  orderList: Order[];
  pagination: Pagination;
};

export const fetchOrderList = async (
  page: number,
  pageSize: number
): Promise<OrderListResponse> => {
  const response = await axios.get("/api/v1/orders", {
    params: { page, pageSize },
  });
  return response.data.data;
};
