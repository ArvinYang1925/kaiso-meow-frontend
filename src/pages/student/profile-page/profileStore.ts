import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { fetchProfile, updateProfile, updatePassword } from "./profile.service";
import { toast } from "@/hooks/use-toast";
import {
  ProfileModel,
  UpdateProfileModel,
  UpdateProfileResponseModel,
  PasswordModel,
  UpdatePasswordModel,
  UpdatePasswordResponseModel,
} from "./types";
import { useAuthStore } from "@/stores/authStore";

interface ProfilePageState {
  profile: ProfileModel;
  password: PasswordModel;
  isLoading: boolean;
  isShowDialog: boolean;
}

interface ProfilePageAction {
  fetchProfile: () => Promise<void>;
  updateProfile: (
    data: UpdateProfileModel
  ) => Promise<UpdateProfileResponseModel>;
  updatePassword: (
    data: UpdatePasswordModel
  ) => Promise<UpdatePasswordResponseModel>;
  setIsLoading: (loading: boolean) => void;
  setIsShowDialog: (isShowDialog: boolean) => void;
  updateProfileFormData: (fields: Partial<ProfileModel>) => void;
  updatePasswordFormData: (fields: Partial<PasswordModel>) => void;
  resetStore: () => void;
}

const initialProfile: ProfileModel = {
  id: "",
  name: "",
  phoneNumber: "",
  email: "",
};

const initialPassword: PasswordModel = {
  oldPassword: "",
  newPassword: "",
  confirmNewPassword: "",
};

export const useProfileStore = create<ProfilePageState & ProfilePageAction>()(
  immer((set) => ({
    profile: initialProfile,
    password: initialPassword,
    isLoading: false,
    isShowDialog: false,
    resetStore: () => {
      set((state) => {
        state.profile = initialProfile;
        state.password = initialPassword;
        state.isLoading = false;
        state.isShowDialog = false;
      });
    },
    fetchProfile: async () => {
      set((state) => {
        state.isLoading = true;
      });
      try {
        const response = await fetchProfile();
        set((state) => {
          state.profile = response.data;
        });
      } catch (error) {
        console.error("Failed to fetch profile", error);
        toast({
          variant: "destructive",
          title: "載入失敗",
          description: "無法取得個人資料，請稍後再試。",
        });
      } finally {
        set((state) => {
          state.isLoading = false;
        });
      }
    },
    updateProfile: async (formData: UpdateProfileModel) => {
      set((state) => {
        state.isLoading = true;
      });
      try {
        const response = await updateProfile(formData);
        const { status, data } = response;
        if (status == "success" && data) {
          // 更新成功後，更新本地狀態
          set((state) => {
            state.profile = data;
          });

          // 同時更新 authStore 中的 userInfo（這會自動更新 localStorage）
          const { updateUserInfo } = useAuthStore.getState();
          updateUserInfo({
            name: data.name,
            phoneNumber: data.phoneNumber,
          });
        }
        return response;
      } catch (error) {
        console.error("Failed to save profile", error);
        toast({
          variant: "destructive",
          title: "儲存失敗",
          description: "無法儲存個人資料，請稍後再試。",
        });
        throw error; // 重新拋出錯誤，讓調用者可以處理
      } finally {
        set((state) => {
          state.isLoading = false;
        });
      }
    },
    updatePassword: async (data: UpdatePasswordModel) => {
      set((state) => {
        state.isLoading = true;
      });
      try {
        const response = await updatePassword(data);
        return response;
      } catch (error) {
        console.error("Failed to update", error);
        toast({
          variant: "destructive",
          title: "密碼變更失敗",
          description: "無法變更密碼，請稍後再試。",
        });
        throw error; // 重新拋出錯誤，讓調用者可以處理
      } finally {
        set((state) => {
          state.isLoading = false;
        });
      }
    },
    setIsLoading: (loading) => {
      set((state) => {
        state.isLoading = loading;
      });
    },

    setIsShowDialog: (isShowDialog) => {
      set((state) => {
        state.isShowDialog = isShowDialog;
      });
    },

    updateProfileFormData: (fields) => {
      set((state) => {
        Object.assign(state.profile, fields);
      });
    },
    updatePasswordFormData: (fields) => {
      set((state) => {
        Object.assign(state.password, fields);
      });
    },
  }))
);
