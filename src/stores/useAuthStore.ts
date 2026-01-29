import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type UserRole = 'user' | 'reformer';

type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
};

type AuthState = {
  user: User | null;
  accessToken: string | null;
  role: UserRole | null; 
  setAuth: (data: { user: User | null; accessToken: string }) => void;
  setAccessToken: (accessToken: string, role?: UserRole) => void;
  setRole: (role: UserRole) => void;
  clearAuth: () => void;
};

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      role: null,
      setAuth: (data) =>
        set({
          user: data.user,
          accessToken: data.accessToken,
          role: data.user?.role || null,
        }),
      setAccessToken: (accessToken, role) =>
        set({
          accessToken,
          role: role || null,
        }),
      setRole: (role) =>
        set({
          role,
        }),
      clearAuth: () =>
        set({
          user: null,
          accessToken: null,
          role: null,
        }),
    }),
    {
      name: 'auth-storage', 
      partialize: (state) => ({ 
        accessToken: state.accessToken,
        role: state.role,
      }), 
    }
  )
);

export default useAuthStore;
export type { User, UserRole };