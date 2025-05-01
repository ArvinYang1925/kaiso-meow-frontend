import { create } from "zustand";
import { loginUser, logoutUser, registerUser } from "@/services/auth.service";
import { LoginFormData, RegisterFormData, LoginResponseData } from "@/services/types";
import { Role } from "@/lib/enum";

interface AuthState {
  token: string | null;
  userInfo: LoginResponseData | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  errorMsg: string | null;
}
interface AuthActions {
  login: (formData: LoginFormData) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  register: (formData: RegisterFormData) => Promise<{ success: boolean; message?: string }>;
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
    set({ isLoading: true, errorMsg: null });
    try {
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
  register: async (formData: RegisterFormData) => {
    set({ isLoading: true, errorMsg: null });
    try {
      const response = await registerUser(formData);
      const { token, userInfo } = response.data.data;

      localStorage.setItem("token", token);
      localStorage.setItem("userInfo", JSON.stringify(userInfo));

      set({ token, userInfo, isAuthenticated: true, isLoading: false });
      return { success: true };
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || "註冊失敗";
      set({
        errorMsg: errorMsg,
        isLoading: false
      });
      return { success: false, message: errorMsg };
    }
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
