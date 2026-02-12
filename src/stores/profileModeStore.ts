import { create } from 'zustand';

export type ProfileMode = 'view' | 'edit';

interface ProfileModeState {
  mode: ProfileMode;
  setMode: (mode: ProfileMode) => void;
}

export const useProfileModeStore = create<ProfileModeState>((set) => ({
  mode: 'view',
  setMode: (mode) => set({ mode }),
}));