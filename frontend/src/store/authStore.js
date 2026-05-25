import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAuthStore = create(
  persist(
    (set) => ({
      token: null,
      user: null,
      role: null,
      setAuth: (token, user, role) => set({ token, user, role }),
      clearAuth: () => set({ token: null, user: null, role: null }),
    }),
    { name: "auth-storage" }
  )
);
/*import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  user: { id: 1, name: "Student", email: "student@example.com" }, // Mock user
  isAuthenticated: true,

  login: (userData) => set({ user: userData, isAuthenticated: true }),
  logout: () => set({ user: null, isAuthenticated: false }),
}));*/