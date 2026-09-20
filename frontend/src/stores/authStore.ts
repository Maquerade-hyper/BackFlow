import { create } from "zustand";
import api from "../api/client";
import type { User } from "../types";

interface AuthState {
  user: User | null;
  token: string | null;
  initialized: boolean;

  initialize: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  register: (
    name: string,
    email: string,
    password: string
  ) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  initialized: false,

  initialize: async () => {
    const token = localStorage.getItem("backflow_token");

    if (!token) {
      set({
        token: null,
        user: null,
        initialized: true,
      });
      return;
    }

    try {
      const response = await api.get<User>("/auth/me");

      set({
        token,
        user: response.data,
        initialized: true,
      });

      localStorage.setItem(
        "backflow_user",
        JSON.stringify(response.data)
      );
    } catch {
      localStorage.removeItem("backflow_token");
      localStorage.removeItem("backflow_user");

      set({
        token: null,
        user: null,
        initialized: true,
      });
    }
  },

  login: async (email, password) => {
    const response = await api.post("/auth/login", {
      email,
      password,
    });

    const token = response.data.access_token;

    localStorage.setItem("backflow_token", token);

    const userResponse = await api.get<User>("/auth/me");

    localStorage.setItem(
      "backflow_user",
      JSON.stringify(userResponse.data)
    );

    set({
      token,
      user: userResponse.data,
      initialized: true,
    });
  },

  register: async (name, email, password) => {
    await api.post("/auth/register", {
      name,
      email,
      password,
    });
  },

  logout: () => {
    localStorage.removeItem("backflow_token");
    localStorage.removeItem("backflow_user");

    set({
      token: null,
      user: null,
      initialized: true,
    });
  },
}));