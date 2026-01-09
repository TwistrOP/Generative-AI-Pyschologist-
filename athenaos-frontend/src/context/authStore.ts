// src/context/authStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Define the shape of the store's state
interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
}

// Create the store
export const useAuthStore = create<AuthState>()(
  // Use persist middleware to save state to localStorage
  persist(
    (set) => ({
      token: null,
      isAuthenticated: false,
      login: (token) => set({ token: token, isAuthenticated: true }),
      logout: () => set({ token: null, isAuthenticated: false }),
    }),
    {
      name: 'auth-storage', // The key to use in localStorage
    }
  )
);