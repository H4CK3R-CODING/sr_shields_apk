// src/state/authStore.js
import { create } from "zustand";

const useAuthStore = create((set) => ({
  isLoggedIn: false,
  role: null, // "admin", "user"
  user: null,
  login: (role, user) => set({ isLoggedIn: true, role, user }),
  logout: () => set({ isLoggedIn: false, role: null, user: null }),
}));

export default useAuthStore;
