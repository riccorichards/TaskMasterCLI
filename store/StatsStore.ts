import { StatsStateType } from "@/types/type";
import { makeRequest } from "@/utils/makeRequest";
import { create } from "zustand";

interface StatsStore extends StatsStateType {
  fetchTimeStats: (username: string) => Promise<void>;
}

export const useStatsStore = create<StatsStore>((set) => ({
  stats: null,
  isLoading: null,
  error: null,
  fetchTimeStats: async (username) => {
    set(() => ({ isLoading: true }));
    try {
      const stats = await makeRequest(`/api/time-stats/${username}`, "GET");
      set(() => ({ stats, isLoading: false }));
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
