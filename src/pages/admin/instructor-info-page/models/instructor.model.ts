import { ApiResponseModel } from "../../models/api.model";

/**
 * 講師個人資料
 */
export interface InstructorProfileModel {
  id?: string;
  name?: string;
  email?: string;
  profileUrl?: string;
  introduction?: string;
}

/**
 * 更新講師個人資料請求
 */
export interface UpdateInstructorProfileModel {
  name: string;
  avatar?: string; 
  introduction?: string;
}

/**
 * API 回應講師個人資料 - getMe API 格式
 */
export type InstructorProfileResponseModel = ApiResponseModel<InstructorProfileModel>;

/**
 * API 回應更新講師個人資料 - updateMe API 格式
 */
export interface UpdateInstructorProfileResponse {
  name: string;
  email: string;
  avatar: string;
}

/**
 * 上傳頭像回應格式
 */
export interface UploadAvatarResponse {
  avatarUrl: string;
}