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
    const response = await makeRequest<string>("/api/auth", "POST", input);
    if (response.status === "success") {
      set(() => ({ user: response.data, isLoading: false }));
    } else {
      set(() => ({
        error: response.message,
        isLoading: false,
      }));
    }
  },
  logIn: async (input) => {
    set(() => ({ isLoading: true }));
    const response = await makeRequest<string>(
      "/api/auth/login",
      "POST",
      input
    );
    if (response.status === "success") {
      set(() => ({ user: response.data, isLoading: false }));
    } else {
      set(() => ({
        error: response.message,
        isLoading: false,
      }));
    }
  },
}));
