import { create } from "zustand";
import { loginUser, logoutUser } from "@/services/auth.service";
import { LoginUserModel } from "@/services/types";
import { getToken, getUserInfo } from "@/lib/auth";

type UserInfo = {
  /** 學生id (uuid唯一值) */
  id: string;
  /** 姓名 */
  name: string;
  /** 手機號碼 */
  phoneNumber: string;
  /** 電子郵件 */
  email: string;
  /** 登入身份 */
  role: string; // student or instructor
}

interface AuthState {
  isLogin: boolean;
  token: string | null;
  userInfo: UserInfo | null;
}
interface AuthActions {
  login: (formData: LoginUserModel) => void;
  logout: () => void;
  setIsLogin: (isLogin: boolean) => void;
}

export const useAuthStore = create<AuthState & AuthActions>((set) => ({
  isLogin: getToken() ? true : false,
  token: getToken(),
  userInfo: getUserInfo(),
  login: async (formData) => {
    const response = await loginUser(formData);

    const token = response.data.data.token
    const userInfo = response.data.data.userInfo

    localStorage.setItem("token", token);
    localStorage.setItem("userInfo", JSON.stringify(userInfo));

    set({ token, userInfo });
    set({ isLogin: true })
  },
  logout: () => {
    logoutUser();
    //以下清空資料
    localStorage.removeItem("token");
    localStorage.removeItem("userInfo");
    set({ token: null, userInfo: null });
    set({ isLogin: false })
  },
  setIsLogin: (isLogin: boolean) => {
    set({ isLogin: isLogin })
  }
}));

