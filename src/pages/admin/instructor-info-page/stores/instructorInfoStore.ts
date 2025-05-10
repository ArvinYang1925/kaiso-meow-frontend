import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { toast } from "@/hooks/use-toast";
import {
  fetchInstructorProfile,
  updateInstructorProfile,
} from "../services/instructor.service";
import {
  InstructorProfileModel,
  UpdateInstructorProfileModel,
} from "../models/instructor.model";

interface InstructorProfileState {
  profile: InstructorProfileModel;
  isLoading: boolean;
  avatarPreview: string;
  selectedFile: File | null;
}

interface InstructorProfileAction {
  fetchProfile: () => Promise<void>;
  updateProfile: (data: UpdateInstructorProfileModel) => Promise<void>;
  setIsLoading: (loading: boolean) => void;
  updateFormData: (fields: Partial<InstructorProfileModel>) => void;
  setAvatarPreview: (url: string) => void;
  setSelectedFile: (file: File | null) => void;
  resetForm: () => void;
}

export const useInstructorProfileStore = create<
  InstructorProfileState & InstructorProfileAction
>()(
  immer((set, get) => ({
    profile: {
      name: "",
      email: "",
      profileUrl: "https://i.meee.com.tw/zQufAr7.png",
    },
    isLoading: false,
    avatarPreview: "https://i.meee.com.tw/zQufAr7.png",
    selectedFile: null,

    fetchProfile: async () => {
      set((state) => {
        state.isLoading = true;
      });
      try {
        const response = await fetchInstructorProfile();
        if (response.status === "success" && response.data) {
          const { name, email } = response.data.data;
          set((state) => {
            state.profile = {
              name: name || "",
              email: email || "",
              profileUrl: "https://i.meee.com.tw/zQufAr7.png",
            };
            state.avatarPreview = "https://i.meee.com.tw/zQufAr7.png";
            state.isLoading = false;
          });
        } else {
          set((state) => {
            state.isLoading = false;
          });
        }
      } catch {
        set((state) => {
          state.isLoading = false;
        });
        toast({
          variant: "destructive",
          title: "載入失敗",
          description: "無法取得講師資料，請稍後再試。",
        });
      }
    },

    updateProfile: async (data) => {
      set((state) => {
        state.isLoading = true;
      });
      try {
        const response = await updateInstructorProfile(data);
        if (response.status === "success" && response.data) {
          const { name, email, profileUrl } = response.data.data;
          set((state) => {
            state.profile = {
              name: name || "",
              email: email || "",
              profileUrl: profileUrl || "https://i.meee.com.tw/zQufAr7.png",
            };
            state.avatarPreview =
              profileUrl || "https://i.meee.com.tw/zQufAr7.png";
          });
          toast({
            title: "儲存成功",
            description: "講師資料已更新。",
          });
        } else {
          toast({
            variant: "destructive",
            title: "儲存失敗",
            description: response.message || "無法儲存講師資料，請稍後再試。",
          });
        }
      } catch {
        toast({
          variant: "destructive",
          title: "儲存失敗",
          description: "無法儲存講師資料，請稍後再試。",
        });
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

    updateFormData: (fields) => {
      set((state) => {
        Object.assign(state.profile, fields);
      });
    },

    setAvatarPreview: (url) => {
      set((state) => {
        state.avatarPreview = url;
      });
    },

    setSelectedFile: (file) => {
      set((state) => {
        state.selectedFile = file;
      });
    },

    resetForm: () => {
      const { profile } = get();
      set((state) => {
        state.avatarPreview = profile.profileUrl || "/src/assets/teacher.png";
        state.selectedFile = null;
      });
    },
  }))
);
