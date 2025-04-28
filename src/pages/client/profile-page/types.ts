/** 學生個人資料 */
export type ProfileModel = {
    email: string;
    name: string;
    phoneNumber: string;
}

/** 更新學生個人資料 */
export type UpdateProfileModel = {
    name: string;
    phoneNumber: string;
}

/** API 回應 學生個人資料 */
export type ProfileResponseModel = {
    status: string;
    data: ProfileModel;
}
