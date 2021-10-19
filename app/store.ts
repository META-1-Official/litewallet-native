import EncryptedStorage from 'react-native-encrypted-storage';
import create from 'zustand';
import { persist } from 'zustand/middleware';

interface AppState {
  accountName: string;
  authorized: boolean;
  authorize: (accountName: string) => void;
  logout: () => void;
}

export const useStore = create<AppState>(
  persist(
    set => ({
      accountName: '',
      authorized: false,
      authorize: (accountName: string) =>
        set({ accountName: accountName.toLowerCase(), authorized: true }),
      logout: () => set({ accountName: '', authorized: false }),
    }),
    {
      name: 'app-storage',
      getStorage: () => EncryptedStorage,
    },
  ),
);
