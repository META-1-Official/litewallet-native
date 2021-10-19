import create from 'zustand';

interface AppState {
  accountName: string;
  authorized: boolean;
  authorize: (accountName: string) => void;
}

export const useStore = create<AppState>(set => ({
  accountName: '',
  authorized: false,
  authorize: (accountName: string) => set({ accountName, authorized: true }),
}));
