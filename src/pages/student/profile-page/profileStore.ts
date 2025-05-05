import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { fetchProfile, updateProfile } from './profile.service';
import { toast } from '@/hooks/use-toast';
import { ProfileModel, UpdateProfileModel, UpdateProfileResponseModel } from './types';

interface ProfilePageState {
    profile: ProfileModel;
    isLoading: boolean;
}


interface ProfilePageAction {
    fetchProfile: () => Promise<void>;
    updateProfile: (data: UpdateProfileModel) => Promise<UpdateProfileResponseModel>;
    setIsLoading: (loading: boolean) => void;
    updateFormData: (fields: Partial<ProfileModel>) => void;
}

export const useProfileStore = create<ProfilePageState & ProfilePageAction>()(
    immer((set) => ({
        profile: {
            id: '',
            name: '',
            phoneNumber: '',
            email: '',
        },
        isLoading: false,
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
                console.error('Failed to fetch profile', error);
                toast({
                    variant: 'destructive',
                    title: '載入失敗',
                    description: '無法取得個人資料，請稍後再試。',
                });
            } finally {
                set((state) => {
                    state.isLoading = false;
                });
            }
        },
        updateProfile: async (data: UpdateProfileModel) => {
            set((state) => {
                state.isLoading = true;
            });
            try {
                const response = await updateProfile(data);
                // 更新成功後，更新本地狀態
                set((state) => {
                    state.profile = {
                        ...state.profile,
                        ...data
                    };
                });
                return response;
            } catch (error) {
                console.error('Failed to save profile', error);
                toast({
                    variant: 'destructive',
                    title: '儲存失敗',
                    description: '無法儲存個人資料，請稍後再試。',
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

        updateFormData: (fields) => {
            set((state) => {
                Object.assign(state.profile, fields);
            });
        },
    }))
);
