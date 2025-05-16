import { ADMIN_ROUTES } from "./route-path";

export const ROUTE_TITLES: Record<string, string> = {
  [ADMIN_ROUTES.DASHBOARD]: "數據儀表板",
  [ADMIN_ROUTES.COURSES]: "課程",
  [ADMIN_ROUTES.CREATE_COURSE]: "開始創建課程",
  [ADMIN_ROUTES.COURSE_INFO]: "課程資訊",
  [ADMIN_ROUTES.CHAPTER_MANAGEMENT]: "章節管理",
  [ADMIN_ROUTES.DEACTIVATE_COURSE]: "下架課程",
  [ADMIN_ROUTES.STUDENTS]: "學生列表",
  [ADMIN_ROUTES.INSTRUCTOR_ORDERS]: "訂單管理",
  [ADMIN_ROUTES.COUPONS]: "折扣碼列表",
  [ADMIN_ROUTES.ME]: "個人設定",
  [ADMIN_ROUTES.CHANGE_PASSWORD]: "變更密碼",
}