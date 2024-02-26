import {
  DailyTaskType,
  HistoryType,
  NotesType,
  TaskStateType,
} from "@/types/type";
import { makeRequest } from "@/utils/makeRequest";
import { create } from "zustand";

interface TaskStore extends TaskStateType {
  fetchTasks: (username: string) => Promise<void>;
  fetchTaskById: (taskId: string, username: string) => Promise<void>;
  addTasksToHistory: (
    username: string,
    tasks: DailyTaskType[]
  ) => Promise<void>;
  fetchHistory: (username: string, fileName: string) => Promise<void>;
  fetchNotes: (username: string) => Promise<void>;
}

export const useTaskStore = create<TaskStore>((set) => ({
  tasks: [],
  task: null,
  history: null,
  notes: [],
  historyResponse: null,
  isLoading: false,
  error: null,
  fetchTasks: async (username) => {
    set({ isLoading: true, error: null });
    const response = await makeRequest<DailyTaskType[]>(
      `/api/task/${username}`,
      "GET"
    );

    if (response.status === "success") {
      set({ tasks: response.data, isLoading: false });
    } else {
      set({ error: response.message, isLoading: false });
    }
  },
  fetchTaskById: async (taskId, username) => {
    set(() => ({ isLoading: true }));
    const response = await makeRequest<DailyTaskType>(
      `/api/task/${username}/${taskId}`,
      "GET"
    );
    if (response.status === "success") {
      set(() => ({ task: response.data, isLoading: false }));
    } else {
      set(() => ({
        error: response.message,
        isLoading: false,
      }));
    }
  },
  addTasksToHistory: async (username, tasks) => {
    set(() => ({ isLoading: true }));
    const response = await makeRequest<string>(
      `/api/task/${username}/history/add-tasks`,
      "POST",
      {
        tasks,
      }
    );
    if (response.status === "success") {
      set(() => ({
        tasks: [],
        historyResponse: response.data,
        isLoading: false,
      }));
    } else {
      set(() => ({
        error: response.message,
        isLoading: false,
      }));
    }
  },
  fetchHistory: async (username, fileName) => {
    set(() => ({ isLoading: true }));
    const response = await makeRequest<HistoryType>(
      `/api/task/${username}/history/${fileName}`,
      "GET"
    );
    if (response.status === "success") {
      set(() => ({ history: response.data, isLoading: false }));
    } else {
      set(() => ({
        error: response.message,
        isLoading: false,
      }));
    }
  },
  fetchNotes: async (username) => {
    set(() => ({ isLoading: true }));
    const response = await makeRequest<NotesType[]>(
      `/api/note/${username}`,
      "GET"
    );
    if (response.status === "success") {
      set(() => ({ notes: response.data, isLoading: false }));
    } else {
      set(() => ({
        error: response.message,
        isLoading: false,
      }));
    }
  },
}));
