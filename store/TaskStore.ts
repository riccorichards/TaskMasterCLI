import { DoneTaskType, TaskStateType } from "@/types/type";
import { makeRequest } from "@/utils/makeRequest";
import { create } from "zustand";

interface TaskStore extends TaskStateType {
  fetchTasks: () => Promise<void>;
  fetchTaskByItsName: (taskName: string) => Promise<void>;
}

export const useTaskStore = create<TaskStore>((set) => ({
  tasks: [],
  task: null,
  isLoading: false,
  error: null,
  fetchTasks: async () => {
    set(() => ({ isLoading: true }));
    try {
      const tasks = await makeRequest("/api/task", "GET");
      set(() => ({ tasks, isLoading: false }));
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
  fetchTaskByItsName: async (taskName) => {
    set(() => ({ isLoading: true }));
    try {
      const task = await makeRequest(`/api/task/${taskName}`, "GET");
      set(() => ({ task, isLoading: false }));
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
