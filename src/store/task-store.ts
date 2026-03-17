import { create } from "zustand";

interface TaskStore {
  selectedTaskId: string | null;
  setTask: (id: string | null) => void;
}

export const useTaskStore = create<TaskStore>((set) => ({
  selectedTaskId: null,
  setTask: (id) => set({ selectedTaskId: id }),
}));