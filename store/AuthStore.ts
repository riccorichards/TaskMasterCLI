import { LogInType, LoginStateType } from "@/types/type";
import { makeRequest } from "@/utils/makeRequest";
import { create } from "zustand";

interface LoginStore extends LoginStateType {
  signup: (v: LogInType) => Promise<void>;
  logIn: (v: LogInType) => Promise<void>;
}

export const useAuthStore = create<LoginStore>((set) => ({
  user: null,
  isLoading: null,
  error: null,
  signup: async (input) => {
    set(() => ({ isLoading: true }));
    try {
      const user = await makeRequest("/api/auth", "POST", input);
      set(() => ({ user, isLoading: false }));
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
  logIn: async (input) => {
    set(() => ({ isLoading: true }));
    try {
      const user = await makeRequest("/api/auth/login", "POST", input);
      set(() => ({ user, isLoading: false }));
    } catch (error) {
      set(() => ({
        error:
          error instanceof Error
            ? error.message
            : "An accupated Error: " + error,
        isLoading: false,
      }));
    }
  },
}));
