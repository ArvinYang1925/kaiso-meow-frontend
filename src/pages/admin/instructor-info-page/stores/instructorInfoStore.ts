import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { toast } from "@/hooks/use-toast";
import {
  fetchInstructorProfile,
  updateInstructorProfile,
  uploadInstructorAvatar,
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
  resetForm: () => Promise<void>;
  uploadAvatar: (file: File) => Promise<void>;
}

const DEFAULT_AVATAR = "https://storage.googleapis.com/kaiso-meow-backend.firebasestorage.app/images/instructor_avatar/instructor-59f470c5-cae0-4053-a168-3de51253e470-1748317241181.png";

export const useInstructorProfileStore = create<
  InstructorProfileState & InstructorProfileAction
>()(
  immer((set, get) => ({
    profile: {
      name: "",
      email: "",
      profileUrl: DEFAULT_AVATAR,
      introduction: "",
    },
    isLoading: false,
    avatarPreview: DEFAULT_AVATAR,
    selectedFile: null,

    fetchProfile: async () => {
      set((state) => {
        state.isLoading = true;
      });
      try {
        const response = await fetchInstructorProfile();
        if (response.status === "success" && response.data) {
          // 修正：直接從 response.data 取得資料，因為後端 getMe API 直接回傳 data
          const { id, name, email, profileUrl, introduction } = response.data;
          set((state) => {
            state.profile = {
              id: id || "",
              name: name || "",
              email: email || "",
              profileUrl: profileUrl || DEFAULT_AVATAR,
              introduction: introduction || "",
            };
            state.avatarPreview = profileUrl || DEFAULT_AVATAR;
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
          // 修正：後端 updateMe API 回傳的格式與 getMe 不同
          // updateMe 回傳: { name, email, avatar }
          // getMe 回傳: { id, name, email, profileUrl }
          const { name, email, avatar } = response.data as { name: string; email: string; avatar: string };
          set((state) => {
            state.profile = {
              ...state.profile,
              name: name || "",
              email: email || "",
              profileUrl: avatar || DEFAULT_AVATAR,
            };
            state.avatarPreview = avatar || DEFAULT_AVATAR;
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

    resetForm: async () => {
      await get().fetchProfile();
      set((state) => {
        state.selectedFile = null;
      });
    },

    uploadAvatar: async (file) => {
      if (file.size > 2 * 1024 * 1024) {
        toast({
          variant: "destructive",
          title: "圖片大小超過 2MB 的限制，請重新上傳圖片"
        });
        return;
      }
      set((state) => { state.isLoading = true; });
      try {
        const response = await uploadInstructorAvatar(file);
        if (response.status === "success" && response.data && response.data.avatar) {
          set((state) => {
            state.avatarPreview = response.data!.avatar;
            if (state.profile) state.profile.profileUrl = response.data!.avatar;
          });
          toast({ title: "上傳成功", description: "講師大頭貼已更新。" });
        } else {
          toast({ variant: "destructive", title: "上傳失敗", description: response.message || "無法上傳大頭貼，請稍後再試。" });
        }
      } catch {
        toast({ variant: "destructive", title: "上傳失敗", description: "無法上傳大頭貼，請稍後再試。" });
      } finally {
        set((state) => { state.isLoading = false; });
      }
    },
  }))
);