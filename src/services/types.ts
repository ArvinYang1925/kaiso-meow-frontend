//全域頁面會用到的type放這，個別頁面的放個別頁面中的 service file 內

/** 使用者登入 請求資料 */
export type LoginFormData = {
    email: string;
    password: string;
}

/** 使用者登入 回應資料 */
export type LoginResponseData = {
    name: string;
    id: string;
    email: string;
    phoneNumber: string;
    role: string;
};

/** 使用者登出 回應資料 */
export type LogoutResponseData = {
    status: string;
    message: string;
};

/** 使用者註冊 */
export type RegisterUserModel = {
    name: string;
    email: string;
    password: string;
}

export type ErrorMessage = {
    success: string;
    message: string;
}