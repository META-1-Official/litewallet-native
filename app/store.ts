import EncryptedStorage from 'react-native-encrypted-storage';
import create from 'zustand';
import { persist } from 'zustand/middleware';
import Omit from 'lodash.omit';
import { signUp } from './utils/miscApi';
import { NETWORK } from '@env';

interface AppState {
  accountName: string;
  password: string;
  authorized: boolean;
  authorize: (accountName: string, password?: string) => void;
  logout: () => void;

  loading: boolean;
  setLoading: (v: boolean) => void;
}

export const useStore = create<AppState>(
  persist(
    set => ({
      accountName: '',
      password: '',
      authorized: false,
      authorize: (accountName, password) => {
        set({
          accountName: accountName,
          authorized: true,
          password: password ? password : '',
        });
        if (NETWORK !== 'TESTNET') {
          signUp({ accountName }).catch(e => e);
        }
      },
      logout: () => set({ accountName: '', authorized: false, password: '' }),

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
