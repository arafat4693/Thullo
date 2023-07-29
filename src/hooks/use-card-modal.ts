import { create } from "zustand";

interface useCardDetailsModalStore {
  cardID: string;
  onOpen: (cardID: string) => void;
  onClose: () => void;
}

export const useCardDetailsModal = create<useCardDetailsModalStore>((set) => ({
  cardID: "",
  onOpen: (cardID) => set({ cardID }),
  onClose: () => set({ cardID: "" }),
}));
