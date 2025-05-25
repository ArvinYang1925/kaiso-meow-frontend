import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

interface CommonModalState {
    isShowModal: boolean;
}

interface CommonModalAction {
    setIsShowModal: (open: boolean) => void;
}

export const useCommonModalStore = create<CommonModalState & CommonModalAction>()(
    immer((set) => ({
        isShowModal: false,
        setIsShowModal: (open) =>
            set((state) => {
                state.isShowModal = open;
            }),
    }))
);
