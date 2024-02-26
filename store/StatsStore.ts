import { StatsStateType, StatsType } from "@/types/type";
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
    const response = await makeRequest<StatsType>(
      `/api/time-stats/${username}`,
      "GET"
    );
    if (response.status === "success") {
      set(() => ({ stats: response.data, isLoading: false }));
    } else {
      set(() => ({
        error: response.message,
        isLoading: false,
      }));
    }
  },
}));
