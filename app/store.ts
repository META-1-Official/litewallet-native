import EncryptedStorage from 'react-native-encrypted-storage';
import create from 'zustand';
import { persist } from 'zustand/middleware';
import Omit from 'lodash.omit';

interface AppState {
  accountName: string;
  authorized: boolean;
  authorize: (accountName: string) => void;
  logout: () => void;

  loading: boolean;
  setLoading: (v: boolean) => void;
}

export const useStore = create<AppState>(
  persist(
    set => ({
      accountName: '',
      authorized: false,
      authorize: (accountName: string) =>
        set({ accountName: accountName.toLowerCase(), authorized: true }),
      logout: () => set({ accountName: '', authorized: false }),

      loading: true,
      setLoading: (loading: boolean) => set({ loading }),
    }),
    {
      name: 'app-storage',
      getStorage: () => EncryptedStorage,
      partialize: state => Omit(state, 'loading'),
    },
  ),
);
