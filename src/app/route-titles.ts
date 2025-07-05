import { ADMIN_ROUTES } from "./route-path";

export const ROUTE_TITLES: Record<string, string> = {
  [ADMIN_ROUTES.DASHBOARD]: "數據儀表板",
  [ADMIN_ROUTES.COURSES]: "課程管理",
  [ADMIN_ROUTES.CREATE_COURSE]: "開始創建課程",
  [ADMIN_ROUTES.COURSE_INFO]: "課程資訊",
  [ADMIN_ROUTES.COURSELIST]: "課程列表",
  [ADMIN_ROUTES.SECTION_MANAGEMENT]: "章節管理",
  [ADMIN_ROUTES.COURSE_PUBLISHING_MANAGEMENT]: "發佈/下架",
  [ADMIN_ROUTES.STUDENTS]: "學生列表",
  [ADMIN_ROUTES.INSTRUCTOR_ORDERS]: "訂單管理",
  [ADMIN_ROUTES.COUPONS]: "折扣碼列表",
  [ADMIN_ROUTES.AI_COUPONS_GENERATOR]: "智慧建立折扣碼計劃",
  [ADMIN_ROUTES.AI_COUPONS_REVIEW]: "促銷策略說明與折扣碼審查",
  [ADMIN_ROUTES.ME]: "個人設定",
  [ADMIN_ROUTES.CHANGE_PASSWORD]: "變更密碼",
};
