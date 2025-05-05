import { create } from "zustand";
import { immer } from "zustand/middleware/immer";


type CommonDialogContent = {
    title: string;
    description: string;
};

interface CommonDialogState {
    isShowDialog: boolean;
    dialogContent: CommonDialogContent;
}

interface CommonDialogAction {
    setIsShowDialog: (open: boolean) => void;
    showCommonDialog: (content: CommonDialogContent) => void;
}

export const useDialogStore = create<CommonDialogState & CommonDialogAction>()(
    immer((set) => ({
        isShowDialog: false,
        dialogContent: { title: "", description: "" },
        setIsShowDialog: (open) =>
            set((state) => {
                state.isShowDialog = open;
            }),
        showCommonDialog: (content) =>
            set((state) => {
                state.dialogContent = content;
                state.isShowDialog = true;
            }),
    }))
);
