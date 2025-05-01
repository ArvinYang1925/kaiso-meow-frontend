import { create } from "zustand";
import { loginUser, logoutUser } from "@/services/auth.service";
import { LoginFormData } from "@/services/types";
import { Role } from "@/lib/enum";

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
  role: Role; // student or instructor
}

interface AuthState {
  token: string | null;
  userInfo: UserInfo | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  errorMsg: string | null;
}
interface AuthActions {
  login: (formData: LoginFormData) =>  Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  setIsLogin: (isLogin: boolean) => void;
  getRole: () => Role | null;
  getHomeRedirect: () => string;
  clearError: () => void;
}

export const useAuthStore = create<AuthState & AuthActions>((set, get) => ({
  token: localStorage.getItem("token") || null,
  userInfo: JSON.parse(localStorage.getItem("userInfo") || "null"),
  isAuthenticated: localStorage.getItem("token") ? true : false,
  isLoading: false,
  errorMsg: null,
  login: async (formData: LoginFormData) => {

    try {
      set({ isLoading: true, errorMsg: null });
      const response = await loginUser(formData);
      const { token, userInfo } = response.data.data;

      localStorage.setItem("token", token);
      localStorage.setItem("userInfo", JSON.stringify(userInfo));

      set({ token, userInfo, isAuthenticated: true, isLoading: false });
      return { success: true };
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || "登入失敗";
      set({
        errorMsg: errorMsg,
        isLoading: false
      });
      return { success: false, message: errorMsg };
    }
  
  },
  logout: () => {
    logoutUser();
    //以下清空資料
    localStorage.removeItem("token");
    localStorage.removeItem("userInfo");
    set({ token: null, userInfo: null, isAuthenticated: false, errorMsg: null });
  },
  setIsLogin: (isLogin: boolean) => {
    set({ isAuthenticated: isLogin })
  },
  getRole: () => {
    return get().userInfo?.role || null
  },
  getHomeRedirect: () => {
    const role = get().getRole();
    
    if (role === Role.STUDENT) {
      return "/";
    } else if (role === Role.INSTRUCTOR) {
      return "/admin";
    }
    
    return "/";
  },
  clearError: () => set({ errorMsg: null })
}));

//在非 React 組件中使用
export const getHomeRedirect = (): string => {
  return useAuthStore.getState().getHomeRedirect();
};
