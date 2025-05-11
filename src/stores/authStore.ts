import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { loginUser, logoutUser, registerUser, sendPasswordForgotLetter } from "@/services/auth.service";
import { LoginFormData, RegisterFormData, LoginResponseData, PasswordForgotFormData, LoginResponse } from "@/services/types";
import { Role } from "@/lib/enum";

interface AuthState {
  token: string | null;
  userInfo: LoginResponseData | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  errorMsg: string | null;
  isShowPasswordForgottenForm: boolean;
}

interface AuthActions {
  login: (formData: LoginFormData) => Promise<LoginResponse>;
  logout: () => void;
  register: (formData: RegisterFormData) => Promise<{ success: boolean; message?: string }>;
  sendPasswordForgotLetter: (formData: PasswordForgotFormData) => Promise<{ status: string; message?: string }>;
  getRole: () => Role | null;
  getHomeRedirect: () => string;
  clearError: () => void;
  setIsShowPasswordForgotForm: (isShow: boolean) => void;
}

export const useAuthStore = create<AuthState & AuthActions>()(
  immer((set, get) => ({
    token: localStorage.getItem("token") || null,
    userInfo: JSON.parse(localStorage.getItem("userInfo") || "null"),
    isAuthenticated: !!localStorage.getItem("token"),
    isLoading: false,
    errorMsg: null,
    isShowPasswordForgottenForm: false,
    login: async (formData: LoginFormData) => {
      set((state) => {
        state.isLoading = true;
        state.errorMsg = null;
      });

      try {
        const response = await loginUser(formData);
        const { token, userInfo } = response.data;

        localStorage.setItem("token", token);
        localStorage.setItem("userInfo", JSON.stringify(userInfo));

        set((state) => {
          state.token = token;
          state.userInfo = userInfo;
          state.isAuthenticated = true;
          state.isLoading = false;
        });

        return response;
      } catch (error: any) {
        set((state) => {
          state.isLoading = false;
        });

        return error.response.data;
      }
    },

    logout: () => {
      logoutUser();
      localStorage.removeItem("token");
      localStorage.removeItem("userInfo");

      set((state) => {
        state.token = null;
        state.userInfo = null;
        state.isAuthenticated = false;
        state.errorMsg = null;
      });
    },

    register: async (formData: RegisterFormData) => {
      set((state) => {
        state.isLoading = true;
        state.errorMsg = null;
      });

      try {
        const response = await registerUser(formData);
        const { token, userInfo } = response.data.data;

        localStorage.setItem("token", token);
        localStorage.setItem("userInfo", JSON.stringify(userInfo));

        set((state) => {
          state.token = token;
          state.userInfo = userInfo;
          state.isAuthenticated = true;
          state.isLoading = false;
        });

        return { success: true };
      } catch (error: any) {
        const errorMsg = error.response?.data?.message || "註冊失敗";
        set((state) => {
          state.errorMsg = errorMsg;
          state.isLoading = false;
        });

        return { success: false, message: errorMsg };
      }
    },

    sendPasswordForgotLetter: async (formData: PasswordForgotFormData) => {
      set((state) => {
        state.isLoading = true;
        state.errorMsg = null;
      });

      try {
        const response = await sendPasswordForgotLetter(formData);

        set((state) => {
          state.isLoading = false;
        });

        return response;
      } catch (error: any) {
        const errorMsg = error.response?.data?.message || "密碼重設信發送失敗";
        set((state) => {
          state.errorMsg = errorMsg;
          state.isLoading = false;
        });

        return { status: "failed", message: errorMsg };
      }
    },


    getRole: () => {
      return get().userInfo?.role || null;
    },

    getHomeRedirect: () => {
      const role = get().getRole();
      if (role === Role.STUDENT) return "/";
      if (role === Role.INSTRUCTOR) return "/admin";
      return "/";
    },

    clearError: () => {
      set((state) => {
        state.errorMsg = null;
      });
    },
    setIsShowPasswordForgotForm: (isShow) => {
      set((state) => {
        state.isShowPasswordForgottenForm = isShow;
      });
    }
  }))
);

// 在非 React 組件中使用
export const getHomeRedirect = (): string => {
  return useAuthStore.getState().getHomeRedirect();
};
