import { create } from "zustand";

interface UserInfo {
  id: string;
  email: string;
  role: string; // student or instructor
}

interface AuthState {
  token: string | null;
  userInfo: UserInfo | null;
  login: (token: string, userInfo: UserInfo) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  userInfo: null,
  login: (token, userInfo) => {
    localStorage.setItem("token", token);
    localStorage.setItem("userInfo", JSON.stringify(userInfo));
    set({ token, userInfo });
  },
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userInfo");
    set({ token: null, userInfo: null });
  },
}));
