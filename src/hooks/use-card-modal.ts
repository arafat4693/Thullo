import { create } from "zustand";

interface useCardDetailsModalStore {
  cardID: string;
  alterValue: (cardID: string) => void;
}

export const useCardDetailsModal = create<useCardDetailsModalStore>((set) => ({
  cardID: "",
  alterValue: (cardID) => set({ cardID }),
}));
