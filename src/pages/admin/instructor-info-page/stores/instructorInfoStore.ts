import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { instructorService } from "../services/instructor.service";
import {
  InstructorProfileModel,
  UpdateInstructorProfileModel,
} from "../models/instructor.model";

const DEFAULT_AVATAR =
  "https://storage.googleapis.com/kaiso-meow-backend.firebasestorage.app/images/instructor_avatar/instructor-59f470c5-cae0-4053-a168-3de51253e470-1748317241181.png";

interface InstructorProfileState {
  profile: InstructorProfileModel;
  isLoading: boolean;
  isUploading: boolean;
  avatarPreview: string;
}

interface InstructorProfileAction {
  fetchProfile: () => Promise<void>;
  updateProfile: (data: UpdateInstructorProfileModel) => Promise<void>;
  uploadAvatar: (file: File) => Promise<void>;
  setAvatarPreview: (url: string) => void;
  resetForm: () => void;
  resetToDefaultAvatar: () => void;
}

export const useInstructorProfileStore = create<
  InstructorProfileState & InstructorProfileAction
>()(
  immer((set, get) => ({
    profile: {} as InstructorProfileModel,
    isLoading: false,
    isUploading: false,
    avatarPreview: "",

    /**
     * 取得講師個人資料
     */
    fetchProfile: async () => {
      set((state) => {
        state.isLoading = true;
      });
      try {
        const response = await instructorService.fetchProfile();

        if (response.status === "success" && response.data) {
          const profileData = response.data as InstructorProfileModel;

          set((state) => {
            state.profile = profileData;
            state.avatarPreview = profileData.profileUrl || DEFAULT_AVATAR;
          });
        }
      } catch {
        // 錯誤由 service 層處理並回傳
      } finally {
        set((state) => {
          state.isLoading = false;
        });
      }
    },

    /**
     * 更新講師個人資料（包含頭像URL）
     */
    updateProfile: async (data: UpdateInstructorProfileModel) => {
      set((state) => {
        state.isLoading = true;
      });
      try {
        // 根據 UpdateInstructorProfileModel，更新時只使用 avatar 字段
        const updateData = {
          ...data,
          avatar: data.avatar,
        };

        const response = await instructorService.updateProfile(updateData);

        if (response.status === "success" && response.data) {
          set((state) => {
            state.profile = response.data as InstructorProfileModel;

            const updatedProfile = response.data as InstructorProfileModel;

            if (updatedProfile.profileUrl) {
              state.avatarPreview = updatedProfile.profileUrl;
            } else if (data.avatar) {
              state.avatarPreview = data.avatar;
            }
          });
        } else {
          throw new Error(response.message || "更新失敗");
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          throw error;
        } else {
          throw new Error("更新失敗：未知錯誤");
        }
      } finally {
        set((state) => {
          state.isLoading = false;
        });
      }
    },

    /**
     * 上傳頭像檔案（只獲取 URL，不直接存檔到資料庫）
     * 用戶需要點擊「更新」按鈕才會將頭像 URL 保存到資料庫
     */
    uploadAvatar: async (file: File) => {
      // 防止重複上傳
      const currentState = get();
      if (currentState.isUploading) {
        return;
      }

      set((state) => {
        state.isUploading = true;
      });

      try {
        // 檔案驗證
        const maxSize = 2 * 1024 * 1024; // 2MB
        const allowedTypes = [
          "image/jpeg",
          "image/jpg",
          "image/png",
          "image/gif",
        ];

        if (file.size > maxSize) {
          throw new Error("檔案大小超過 2MB 限制");
        }

        if (!allowedTypes.includes(file.type)) {
          throw new Error(`不支援的檔案類型: ${file.type}`);
        }

        const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");

        const processedFile = new File([file], sanitizedFileName, {
          type: file.type,
          lastModified: file.lastModified,
        });

        // 只呼叫 uploadImageFile，不呼叫 uploadAvatar
        const response = await instructorService.uploadImageFile(processedFile);

        if (response.status === "success") {
          let imageUrl = null;

          if (response.data) {
            imageUrl =
              response.data.url ||
              response.data.imageUrl ||
              response.data.avatarUrl ||
              response.data.profileUrl ||
              response.data.coverUrl;
          }

          if (imageUrl) {
            set((state) => {
              state.avatarPreview = imageUrl;
              state.isUploading = false;
            });
          } else {
            set((state) => {
              state.isUploading = false;
            });
            throw new Error("上傳成功但無法獲取圖片URL");
          }
        } else {
          set((state) => {
            state.isUploading = false;
          });
          throw new Error(response.message || "上傳失敗");
        }
      } catch (error) {
        set((state) => {
          state.isUploading = false;
        });
        if (error instanceof Error) {
          throw error;
        } else {
          throw new Error("上傳失敗：未知錯誤");
        }
      }
    },

    /**
     * 手動設定頭像預覽 URL
     */
    setAvatarPreview: (url: string) => {
      set((state) => {
        state.avatarPreview = url;
      });
    },

    /**
     * 重置表單到原始狀態
     */
    resetForm: () => {
      const { profile } = get();
      set((state) => {
        state.avatarPreview = profile.profileUrl || DEFAULT_AVATAR;
      });
    },

    /**
     * 重置為預設頭像
     */
    resetToDefaultAvatar: () => {
      set((state) => {
        state.avatarPreview = DEFAULT_AVATAR;
      });
    },
  }))
);
