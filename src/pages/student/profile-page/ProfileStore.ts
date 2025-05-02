import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { fetchProfile, updateProfile } from './profile.service';
import { toast } from '@/hooks/use-toast';
import { ProfileModel, UpdateProfileModel } from './types';

interface ProfilePageState {
    profile: ProfileModel;
    isLoading: boolean;
}

interface ProfilePageAction {
    fetchProfile: () => Promise<void>;
    updateProfile: (data: UpdateProfileModel) => Promise<void>;
    setIsLoading: (loading: boolean) => void;
    updateFormData: (fields: Partial<ProfileModel>) => void;
}

export const useProfileStore = create<ProfilePageState & ProfilePageAction>()(
    immer((set, get) => ({
        profile: {
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

        updateProfile: async () => {
            const { profile } = get();
            set((state) => {
                state.isLoading = true;
            });
            try {
                const updateData: UpdateProfileModel = {
                    name: profile.name,
                    phoneNumber: profile.phoneNumber,
                };
                await updateProfile(updateData);
                toast({
                    title: '儲存成功',
                    description: '個人資料已更新。',
                });
            } catch (error) {
                console.error('Failed to save profile', error);
                toast({
                    variant: 'destructive',
                    title: '儲存失敗',
                    description: '無法儲存個人資料，請稍後再試。',
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
    }))
);
