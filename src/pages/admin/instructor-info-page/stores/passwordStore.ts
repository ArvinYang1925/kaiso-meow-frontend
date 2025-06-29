import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { updatePassword } from "../services/password.service";
import { PasswordFormValues } from "../models/password.model";
import { AxiosError } from "axios";
import { useDialogStore } from "@/stores/commonDialogStore";

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
        if (data.newPassword !== data.confirmNewPassword) {
          useDialogStore.getState().showCommonDialog({
            type: "failed",
            message: "兩次輸入的密碼不一致",
          });
          return false;
        }

        // 調用 API 服務
        const response = await updatePassword(data);

        if (response.status === "success") {
          useDialogStore.getState().showCommonDialog({
            type: "success",
            message: "您的密碼已成功更新",
          });
          return true;
        } else {
          useDialogStore.getState().showCommonDialog({
            type: "failed",
            message: response.message || "密碼變更失敗",
          });
          return false;
        }
      } catch (error: unknown) {
        let errorMessage = "密碼變更失敗";

        if (error instanceof AxiosError) {
          const errorData = error.response?.data;

          if (
            errorData?.status === "failed" ||
            error.response?.status === 400
          ) {
            useDialogStore.getState().showCommonDialog({
              type: "failed",
              message: errorData?.message || "請確認輸入的密碼是否正確",
            });
            return false;
          }
          errorMessage = errorData?.message || error.message;
        } else if (error instanceof Error) {
          try {
            const parsedError = JSON.parse(error.message);
            errorMessage = parsedError.message;
          } catch {
            errorMessage = error.message;
          }
        }

        useDialogStore.getState().showCommonDialog({
          type: "failed",
          message: errorMessage,
        });

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
