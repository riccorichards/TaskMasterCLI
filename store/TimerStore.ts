import { DoneTaskType, TimerStoreType } from "@/types/type";
import { makeRequest } from "@/utils/makeRequest";
import { create } from "zustand";

interface TimerStore extends TimerStoreType {
  getTimerInfo: (ms: number | null, taskTitle: string | null) => void;
  sendDoneTaskInfo: (info: DoneTaskType) => Promise<string | undefined>;
}

export const useTimerStore = create<TimerStore>((set) => ({
  isLoading: null,
  ms: null,
  taskTitle: null,
  error: null,
  getTimerInfo: (ms, taskTitle) => set({ ms, taskTitle }),
  sendDoneTaskInfo: async (info) => {
    set(() => ({ isLoading: true }));
    try {
      const { title, ...other } = info;
      const response = await makeRequest(`/api/task/${title}`, "PUT", {
        ...other,
      });
      if (response) {
        set(() => ({ isLoading: false }));
        set(() => ({ ms: null, taskTitle: null }));
        return "Success: Task marked as a complete...";
      }
    } catch (error) {
      set(() => ({
        error:
          error instanceof Error
            ? error.message
            : "An occupated Error: " + error,
        isLoading: false,
      }));
    }
  },
}));
