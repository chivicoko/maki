// src/store/uiStore.ts
import { create } from "zustand";

interface UIState {
  selectedProject: string;
  setProject: (id: string) => void;
}

export const useUIStore = create<UIState>((set) => ({
  selectedProject: "all",
  setProject: (id) => set({ selectedProject: id }),
}));