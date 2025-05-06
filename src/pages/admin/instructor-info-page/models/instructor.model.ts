import { ApiResponseModel } from "./api.model";

/**
 * 講師個人資料
 */
export interface InstructorProfileModel {
  name?: string;
  email?: string;
  profileUrl?: string;
}

/**
 * 更新講師個人資料請求
 */
export interface UpdateInstructorProfileModel {
  name: string;
  email?: string;
  profileUrl?: string;
}

/**
 * API 回應講師個人資料
 */
export type InstructorProfileResponseModel = ApiResponseModel<{
  data: InstructorProfileModel;
}>;
