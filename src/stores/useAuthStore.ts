import { create } from 'zustand';

type User = {
  id: string;
  name: string;
  email: string;
};

type AuthState = {
  user: User | null;
  accessToken: string | null;
  setAuth: (data: { user: User; accessToken: string }) => void;
  clearAuth: () => void;
};

const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  setAuth: (data) =>
    set({
      user: data.user,
      accessToken: data.accessToken,
    }),
  clearAuth: () =>
    set({
      user: null,
      accessToken: null,
    }),
}));

export default useAuthStore;
