import { DailyTastType, TaskStateType } from "@/types/type";
import { makeRequest } from "@/utils/makeRequest";
import { create } from "zustand";

interface TaskStore extends TaskStateType {
  fetchTasks: (username: string) => Promise<void>;
  fetchTaskByItsName: (taskName: string) => Promise<void>;
  addTasksToHistory: (tasks: DailyTastType[]) => Promise<string | undefined>;
  fetchHistory: (fileName: string) => Promise<void>;
}

export const useTaskStore = create<TaskStore>((set) => ({
  tasks: [],
  task: null,
  history: null,
  historyResponse: null,
  isLoading: false,
  error: null,
  fetchTasks: async (username) => {
    set(() => ({ isLoading: true }));
    try {
      const tasks = await makeRequest(`/api/task/user-task/${username}`, "GET");
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
  addTasksToHistory: async (tasks) => {
    set(() => ({ isLoading: true }));
    try {
      const res = await makeRequest(`/api/task/hitory/add-tasks`, "POST", {
        tasks,
      });
      set(() => ({ tasks: [], historyResponse: res, isLoading: false }));
      return res;
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
  fetchHistory: async (fileName) => {
    set(() => ({ isLoading: true }));
    try {
      const history = await makeRequest(`/api/task/history/${fileName}`, "GET");
      set(() => ({ history, isLoading: false }));
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
