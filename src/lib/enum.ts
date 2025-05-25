/** 會員角色 */
export enum Role {
    STUDENT = 'student',
    INSTRUCTOR = 'instructor'
}

/** 訂單狀態 */
export enum OrderStatus {
    FAILED = 'failed',
    PAID = 'paid',
    PENDING = 'pending'
}

/** 折扣碼類型 */
export enum CouponType {
    FIXED = 'fixed',
    PERCENTAGE = 'percentage'
}