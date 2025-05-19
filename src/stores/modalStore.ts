import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { ReactNode } from "react";

interface ModalState {
  isOpen: boolean;
  title?: string;
  body?: ReactNode;
  footer?: ReactNode;
}

interface ModalActions {
  openModal: (options: {
    title?: string;
    body?: ReactNode;
    footer?: ReactNode;
  }) => void;
  closeModal: () => void;
}

export const useModalStore = create<ModalState & ModalActions>()(
  immer((set) => ({
    isOpen: false,
    title: "",
    body: null,
    footer: null,
    openModal: ({ title, body, footer }) =>
      set((state) => {
        state.isOpen = true;
        state.title = title;
        state.body = body;
        state.footer = footer;
      }),
    closeModal: () =>
      set((state) => {
        state.isOpen = false;
        state.title = "";
        state.body = null;
        state.footer = null;
      }),
  }))
);
