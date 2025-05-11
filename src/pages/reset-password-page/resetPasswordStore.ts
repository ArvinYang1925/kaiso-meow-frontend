import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { resetPassword, ResetPasswordModel } from "./reset-password.service";
import { ApiResponseModel } from "@/services/types";

interface ResetPasswordState {
    isLoading: boolean;
    serverError: string;
}

interface ResetPasswordActions {
    setServerError: (errorMessage: string) => void;
    resetPassword: (postData: ResetPasswordModel) => Promise<ApiResponseModel>;
}

export const useResetPasswordStore = create<ResetPasswordState & ResetPasswordActions>()(
    immer((set) => ({
        isLoading: false,
        serverError: '',
        setServerError: (errorMessage) => {
            set((state) => {
                state.serverError = errorMessage
            });
        },
        resetPassword: async (postData) => {
            set((state) => {
                state.isLoading = true;
            });
            try {
                const response = await resetPassword(postData);
                return response;
            } catch (error: any) {
                console.error('Failed to update', error);

                const errorMessage =
                    error?.customMessage ||
                    error?.response?.data?.message ||
                    '無法變更密碼，請稍後再試。';

                set((state) => {
                    state.serverError = errorMessage;
                });
                throw error;
            } finally {
                set((state) => {
                    state.isLoading = false;
                });
            }
        }
    }))
);