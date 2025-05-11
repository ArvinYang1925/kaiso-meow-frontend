//全域頁面會用到的type放這，個別頁面的放個別頁面中的 service file 內
import { Role } from "@/lib/enum";

/** 使用者登入 請求資料 */
export type LoginFormData = {
    email: string;
    password: string;
}

/** 使用者表單資料 */
export type RegisterFormData = {
    name: string;
    email: string;
    password: string;
    confirmPassword?: string;
};

/** 使用者登入 回應資料 */
export type LoginResponseData = {
    /** 學生id (uuid唯一值) */
    id: string;
    /** 姓名 */
    name: string;
    /** 電子郵件 */
    email: string;
    /** 手機號碼 */
    phoneNumber: string;
    /** 登入身份 */
    role: Role; // student or instructor
};

/** 使用者登入 成功回應資料 */
export type LoginSuccessResponse = BaseApiResponseModel & {
    status: 'success';
    data: {
        token: string;
        expiresIn: number;
        userInfo: LoginResponseData;
    };
};

/** 使用者登入 失敗回應資料 （沒有 data）*/
export type LoginFailedResponse = BaseApiResponseModel & {
    status: 'failed';
};

export type LoginResponse = LoginSuccessResponse | LoginFailedResponse;

/** 使用者登出 回應資料 */
export type LogoutResponseData = {
    status: string;
    message: string;
};

/** 使用者登入 發送忘記密碼信件 請求資料 */
export type PasswordForgotFormData = {
    email: string;
}

export type ErrorMessage = {
    success: string;
    message: string;
}

export type BaseApiResponseModel = {
    status: 'success' | 'failed';
    message?: string;
}

