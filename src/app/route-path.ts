/** 前台 */
export const CLIENT_ROUTES = Object.freeze({
  /** 首頁 */
  HOME: "/",
  /** 課程列表 */
  COURSE_LIST: "/course-list",
  /** 我的學習 */
  MY_LEARNING: "/my-learning",
  /** 個人資料 */
  PROFILE: "/profile",
  /** 購買紀錄列表 */
  ORDER_LIST: "/order-list",
  /** 訂單詳細資訊列表 */
  ORDER: "/order/:courseId",
  /** 訂單結帳 callback 頁面 */
  CHECKOUT: "/checkout/:orderId",
  COURSE_PLAYER: 'course-player'
});

/** 後台 */
export const ADMIN_ROUTES = Object.freeze({
  /** 首頁 */
  HOME: "/admin",
  /** 數據儀表板 */
  DASHBOARD: "/admin/dashboard",
  /** 課程 */
  COURSES: "/admin/courses",
  /** 開始創建課程 */
  CREATE_COURSE: "/admin/courses/create",
  /** 課程資訊 */
  COURSE_INFO: "/admin/courses/:courseId/info",
  /** 章節管理 */
  CHAPTER_MANAGEMENT: "/admin/courses/:courseId/chapters",
  /** 下架課程 */
  DEACTIVATE_COURSE: "/admin/courses/:courseId/deactivate",
  /** 學生列表 */
  STUDENTS: "/admin/students",
  /** 訂單管理*/
  INSTRUCTOR_ORDERS: "/admin/instructor-orders",
  /** 個人設定*/
  ME: "/admin/me",
  /** 變更密碼 */
  CHANGE_PASSWORD: "/admin/me/change-password",
  /** 優惠券 */
  COUPONS: "/admin/coupons",
  /** 章節管理 */
  SECTION_MANAGEMENT: "/admin/courses/:courseId/sections",
});

/** 公共權限頁面 */
export const PUBLIC_ROUTES = Object.freeze({
  AUTH: "/auth",
  LOGOUT: "/logout",
  RESET_PASSWORD: "/reset-password/:token",
  PERMISSION_DENIED: "/permission-denied",
  /** 課程詳細頁面 */
  COURSE: "/course/:courseId",
});
