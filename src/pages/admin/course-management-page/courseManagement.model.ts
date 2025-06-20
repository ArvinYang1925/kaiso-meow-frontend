// ============================
//  Course 型別定義
// ============================
import { ApiResponseModel } from "@/pages/admin/models/api.model";

// 課程篩選條件模型
export type CourseFilterModel = {
  isPublished?: boolean;
  isFree?: boolean;
  search?: string;
};

export type Course = {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  highlight?: string;
  duration: number;
  isPublished: boolean;
  price: number;
  isFree: boolean;
  coverUrl?: string;
  instructorId: string;
  isReady: boolean;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
};

// ============================
//  資料模型定義
// ============================

// 創建課程模型 API #32
export type CreateCourseModel = {
  title: string;
  subtitle?: string;
  description: string;
  highlight?: string;
  duration: number;
  price: number;
  isFree: boolean;
  coverUrl?: string;
  isReady?: boolean;
};

// 更新課程模型 (API #35)
export type UpdateCourseModel = {
  title: string;
  subtitle?: string;
  description: string;
  highlight?: string;
  duration: number;
  price: number;
  isFree: boolean;
  coverUrl?: string;
  isReady?: boolean;
};

// 切換課程發布狀態模型 (API #49)
export type TogglePublishModel = {
  isPublished: boolean;
};

// 分頁查詢參數模型
export type PaginationParamsModel = {
  page: number;
  pageSize: number;
};

// 課程列表項目模型（API #31）
export type CourseListItemModel = {
  id: string;
  title: string;
  coverUrl?: string;
  isFree: boolean;
  price: number;
  isPublished: boolean;
  studentCount: number;
  createdAt: Date;
  instructorName: string;
  isReady: boolean;
};

// 分頁資訊模型
export type PaginationInfoModel = {
  currentPage: number;
  pageSize: number;
  totalPages: number;
  totalItems: number;
};

// ============================
// API 回應型別定義（使用統一的 ApiResponseModel）
// ============================

// 創建課程回應 API #32
export type CreateCourseResponse = ApiResponseModel<Course>;

// 取得課程詳細資訊回應 API #34
export type GetCourseDetailResponse = ApiResponseModel<Course>;

// 更新課程回應 API #35
export type UpdateCourseResponse = ApiResponseModel<Course>;

// 取得課程列表回應 API #31
export type GetCoursesResponse = ApiResponseModel<{
  courseList: CourseListItemModel[];
  pagination: PaginationInfoModel;
}>;

// 切換發布狀態回應 API #49
export type TogglePublishResponse = ApiResponseModel<{
  courseId: string;
  isPublished: boolean;
}>;

// 刪除課程回應 API #36
export type DeleteCourseResponse = ApiResponseModel;

// 上傳封面回應 API #33
export type UploadCoverResponse = ApiResponseModel<{
  coverUrl: string;
}>;
