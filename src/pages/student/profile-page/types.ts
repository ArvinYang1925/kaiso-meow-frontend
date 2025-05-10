/** 學生個人資料 */
export type ProfileModel = {
    id: string;
    email: string;
    name: string;
    phoneNumber: string;
}

/** 更新學生個人資料 */
export type UpdateProfileModel = {
    name: string;
    phoneNumber: string;
}

/** API 回應 更新學生個人資料 */
export type UpdateProfileResponseModel = {
    status: 'success' | 'error';
    message: string;
    data: ProfileModel;
}

/** API 回應 學生個人資料 */
export type ProfileResponseModel = {
    status: string;
    data: ProfileModel;
}

/** 變更密碼資料 */
export type PasswordModel = {
    oldPassword: string;
    newPassword: string;
    confirmNewPassword: string;
}

/** API 回應 更新學生個人資料 */
export type UpdatePasswordResponseModel = {
    status: 'success' | 'error';
    message: string;
}

/** 更新密碼資料 */
export type UpdatePasswordModel = {
    oldPassword: string;
    newPassword: string;
    confirmNewPassword: string;
}