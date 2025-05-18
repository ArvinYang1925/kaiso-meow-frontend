export interface ApiResponseModel<T = void> {
  status: "success" | "error" | "failed";
  message: string;
  data?: T;
}
