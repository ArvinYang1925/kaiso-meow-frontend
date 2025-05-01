/** 前台 */
export const CLIENT_ROUTES = {
    /** 首頁 */
    HOME: '/',
    /** 課程列表 */
    COURSES: '/courses',
    /** 我的學習 */
    LEARNING: '/learning',
    /** 個人資料 */
    PROFILE: '/profile',
    /** 購買紀錄 */
    ORDER: '/order'
};

/** 後台 */
export const ADMIN_ROUTES = {
    /** 首頁 */
    HOME: '/admin',
    /** 優惠券 */
    COUPONS: '/admin/coupons',
};

/** 公共權限頁面 */
export const PUBLIC_ROUTES = {
    LOGIN: '/login',
    LOGOUT: '/logout',
    REGISTER: '/register',
    PERMISSION_DENIED: '/permission-denied',
}