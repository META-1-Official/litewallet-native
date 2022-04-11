import EncryptedStorage from 'react-native-encrypted-storage';
import create from 'zustand';
import { persist } from 'zustand/middleware';
import Omit from 'lodash.omit';
import { signUp } from './utils/miscApi';
import { NETWORK } from '@env';
import { loadAvatar } from './utils/avatarApi';

interface AppState {
  accountName: string;
  password: string;
  authorized: boolean;
  avatarUrl: string;
  authorize: (accountName: string, password?: string) => void;
  logout: () => void;
  setAvatar: (url: string) => void;

  loading: boolean;
  setLoading: (v: boolean) => void;
}

export const useStore = create<AppState>(
  persist(
    set =>
      ({
        accountName: '',
        password: '',
        authorized: false,
        avatarUrl: '',
        authorize: (accountName, password) => {
          set({
            accountName: accountName,
            authorized: true,
            password: password ? password : '',
          });
          if (NETWORK !== 'TESTNET') {
            signUp({ accountName }).catch(e => e);
            setTimeout(() => loadAvatar().then(url => set({ avatarUrl: url })), 100);
          }
        },
        setAvatar: (url: string) => set({ avatarUrl: url }),
        logout: () => set({ accountName: '', authorized: false, password: '', avatarUrl: '' }),
        loading: true,
        setLoading: (loading: boolean) => set({ loading }),
      } as AppState),
    {
      name: 'app-storage',
      getStorage: () => EncryptedStorage,
      partialize: state => Omit(state, 'loading'),
    },
  ),
);
