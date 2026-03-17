// src/store/uiStore.ts
import { create } from "zustand";

interface UIState {
  selectedProject: string | null;
  setProject: (id: string) => void;
}

export const useUIStore = create<UIState>((set) => ({
  selectedProject: null,
  setProject: (id) => set({ selectedProject: id }),
}));