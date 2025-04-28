import { create } from "zustand";

type CommonDialogContent = {
    title: string;
    description: string;
}

interface CommonDialogState {
    isShowDialog: boolean;
    dialogContent: CommonDialogContent;
}
interface CommonDialogAction {
    setIsShowDialog: (open: boolean) => void;
    showCommonDialog: (content: CommonDialogContent) => void;
}

export const useDialogStore = create<CommonDialogState & CommonDialogAction>((set) => ({
    isShowDialog: false,
    dialogContent: { title: "", description: "" },
    setIsShowDialog: (open) => set({ isShowDialog: open }),
    showCommonDialog: (content) => set({ dialogContent: content, isShowDialog: true }),
}));
