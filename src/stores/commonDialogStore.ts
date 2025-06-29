import { create } from "zustand";
import { immer } from "zustand/middleware/immer";


type CommonDialogContent = {
    type: string;
    message?: string;
    onClose?: () => void; // 關閉按鈕的回調函數
    onConfirm?: () => void; // 確認按鈕的回調函數
};

interface CommonDialogState {
    isShowDialog: boolean;
    dialogContent: CommonDialogContent;
}

interface CommonDialogAction {
    setIsShowDialog: (open: boolean) => void;
    showCommonDialog: (content: CommonDialogContent) => void;
    closeDialog: () => void; // 關閉對話框並執行回調
}

export const useDialogStore = create<CommonDialogState & CommonDialogAction>()(
    immer((set, get) => ({
        isShowDialog: false,
        dialogContent: { type: "", message: "" },
        setIsShowDialog: (open) =>
            set((state) => {
                state.isShowDialog = open;
            }),
        showCommonDialog: (content) =>
            set((state) => {
                state.dialogContent = content;
                state.isShowDialog = true;
            }),
        closeDialog: () => {
            const { dialogContent } = get();

            // 先關閉對話框
            set((state) => {
                state.isShowDialog = false;
            });

            // 執行回調函數（如果有的話）
            if (dialogContent.onClose) {
                // 使用 setTimeout 確保對話框關閉動畫完成後再執行回調
                setTimeout(() => {
                    dialogContent.onClose!();
                }, 150); // 可以根據對話框動畫時間調整
            }
        },
    }))
);
