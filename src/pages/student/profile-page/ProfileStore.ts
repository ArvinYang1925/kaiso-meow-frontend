import { create } from 'zustand';
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
    /** Partial<ProfileModel> 表示你傳進來的物件裡可以是 ProfileModel 型別的部分欄位。 */
    updateFormData: (fields: Partial<ProfileModel>) => void;
}

export const useProfileStore = create<ProfilePageState & ProfilePageAction>((set, get) => ({
    profile: {
        name: '',
        phoneNumber: '',
        email: 'test@example.com'
    },
    isLoading: false,
    fetchProfile: async () => {
        set({ isLoading: true });
        try {
            const response = await fetchProfile();
            set({ profile: response });
        } catch (error) {
            console.error('Failed to fetch profile', error);
            toast({
                variant: 'destructive',
                title: '載入失敗',
                description: '無法取得個人資料，請稍後再試。',
            });
        } finally {
            set({ isLoading: false });
        }
    },

    updateProfile: async () => {
        const { profile } = get();
        set({ isLoading: true });
        try {
            const updateData: UpdateProfileModel = {
                name: profile.name,
                phoneNumber: profile.phoneNumber
            }
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
            set({ isLoading: false });
        }
    },
    setIsLoading: (loading) => {
        set({ isLoading: loading });
    },
    updateFormData: (fields) => {
        set((state) => ({
            profile: state.profile ? { ...state.profile, ...fields } : {
                name: '',
                phoneNumber: '',
                email: ''
            },
        }));
    },
}));
