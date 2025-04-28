//全域頁面會用到的type放這，個別頁面的放個別頁面中的 service file 內

export type LoginResponseData = {
    name: string;
    id: string;
    email: string;
    phoneNumber: string;
    role: string;
};

export type LogoutResponseData = {
    status: string;
    message: string;
};
