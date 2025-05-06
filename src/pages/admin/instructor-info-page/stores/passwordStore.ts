import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { toast } from '@/hooks/use-toast';
import { getPasswordService } from "../services/password.service";
import { PasswordFormValues, ChangePasswordRequestModel } from '../models/password.model';

interface PasswordState {
  isLoading: boolean;
  error: string | null;
}

interface PasswordAction {
  changePassword: (data: PasswordFormValues) => Promise<boolean>;
  resetError: () => void;
}

export const usePasswordStore = create<PasswordState & PasswordAction>()(
  immer((set) => ({
    isLoading: false,
    error: null,

    changePassword: async (data: PasswordFormValues) => {
      set((state) => {
        state.isLoading = true;
        state.error = null;
      });
      
      try {
        // 驗證新密碼和確認密碼是否一致
        if (data.newPassword !== data.confirmPassword) {
          throw new Error('兩次輸入的密碼不一致');
        }
        
        // 準備 API 請求數據
        const requestData: ChangePasswordRequestModel = {
          currentPassword: data.currentPassword,
          newPassword: data.newPassword,
        };
        
        // 獲取當前環境下的密碼變更服務
        const passwordService = getPasswordService();
        
        // 調用 API 服務
        await passwordService(requestData);
        
        // 顯示成功提示
        toast({
          title: "密碼變更成功",
          description: "您的密碼已成功更新",
        });
        
        return true;
      } catch (error: any) {
        set((state) => {
          state.error = error.message || "密碼變更失敗";
        });
        
        // 顯示錯誤提示
        toast({
          variant: 'destructive',
          title: "密碼變更失敗",
          description: error.message || "請稍後再試",
        });
        
        console.error("密碼變更錯誤:", error);
        return false;
      } finally {
        set((state) => {
          state.isLoading = false;
        });
      }
    },
    
    resetError: () => {
      set((state) => {
        state.error = null;
      });
    },
  }))
);




// import { create } from 'zustand';
// import { ADMIN_ROUTES } from '@/app/route-path';
// import { useDialogStore } from '@/stores/CommonDialogStore';
// import { PasswordService } from './Password.service';

// export interface PasswordFormValues {
//   currentPassword: string;
//   newPassword: string;
//   confirmPassword: string;
// }

// interface PasswordState {
//   isLoading: boolean;
//   error: string | null;
//   changePassword: (data: PasswordFormValues) => Promise<void>;
// }

// export const usePasswordStore = create<PasswordState>((set) => ({
//   isLoading: false,
//   error: null,
//   changePassword: async (data) => {
//     try {
//       set({ isLoading: true, error: null });
      
//       // 調用 PasswordService 來處理密碼變更
//       await PasswordService.changePassword(data);
      
//       const { showCommonDialog, setIsShowDialog } = useDialogStore.getState();
      
//       showCommonDialog({
//         title: "密碼變更成功",
//         description: "您的密碼已成功更新",
//       });
      
//       // 使用 setTimeout 來確保對話框顯示後再導航
//       setTimeout(() => {
//         setIsShowDialog(false);
//         window.location.href = `/#${ADMIN_ROUTES.ME}`;
//       }, 1500);
//     } catch (error: any) {
//       set({ error: error.message || "密碼變更失敗" });
      
//       const { showCommonDialog } = useDialogStore.getState();
//       showCommonDialog({
//         title: "密碼變更失敗",
//         description: error.message || "請稍後再試",
//       });
      
//       console.error("密碼變更錯誤:", error);
//     } finally {
//       set({ isLoading: false });
//     }
//   },
// })); 