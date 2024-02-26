import { DoneTaskType, TimerStoreType } from "@/types/type";
import { makeRequest } from "@/utils/makeRequest";
import { create } from "zustand";

interface TimerStore extends TimerStoreType {
  getTimerInfo: (ms: number | null, taskTitle: string | null) => void;
  sendDoneTaskInfo: (
    info: DoneTaskType,
    username: string
  ) => Promise<string | undefined>;
}

export const useTimerStore = create<TimerStore>((set) => ({
  isLoading: null,
  ms: null,
  taskTitle: null,
  error: null,
  getTimerInfo: (ms, taskTitle) => set({ ms, taskTitle }),
  sendDoneTaskInfo: async (info, username) => {
    set(() => ({ isLoading: true }));
    const { taskId, ...other } = info;
    const response = await makeRequest<string>(
      `/api/task/${username}/${taskId}`,
      "PUT",
      {
        ...other,
      }
    );
    if (response.status === "success") {
      set(() => ({ isLoading: false }));
      set(() => ({ ms: null, taskTitle: null }));
      return "Success: Task marked as a complete...";
    } else {
      set(() => ({
        error: response.message,
        isLoading: false,
      }));
    }
  },
}));
