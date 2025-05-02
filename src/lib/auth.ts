/** 取得 localStorage 中目前的 userInfo */
export const getUserInfo = () => {
    const userInfoString = typeof window !== 'undefined' ? localStorage.getItem("userInfo") : null;
    const userInfo = userInfoString ? JSON.parse(userInfoString) : null;
    return userInfo
}