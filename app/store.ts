import EncryptedStorage from 'react-native-encrypted-storage';
import create from 'zustand';
import { persist } from 'zustand/middleware';
import Omit from 'lodash.omit';
import { signUp } from './services/litewalletApi';

interface AppState {
  accountName: string;
  password: string;
  authorized: boolean;
  avatarUrl: string;
  token: string;
  authorize: (accountName: string, password?: string) => void;
  logout: () => void;
  setToken: (token: string) => void;
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
          signUp({ accountName }).catch(e => console.warn(e));
        },
        token: '',
        setToken: (token: string) => set({ token }),
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

interface OptionsValues {
  sentryEnabled: boolean;
  firstTime: boolean;
}

type SetterNameT = `${keyof OptionsValues}Set`;
type OptionsState = {
  [key in SetterNameT]: (arg: boolean) => void;
} & OptionsValues;

export const useOptions = create(
  persist(
    set =>
      ({
        sentryEnabled: false,
        firstTime: true,
        //---------------
        sentryEnabledSet: sentryEnabled => set({ sentryEnabled }),
        firstTimeSet: firstTime => set({ firstTime }),
      } as OptionsState),
    {
      name: 'options-storage',
      getStorage: () => EncryptedStorage,
    },
  ),
);

type OptionsT = (() => OptionsState) & {
  get: (key: keyof OptionsValues) => boolean;
};
// Just a Callable object nothing to special
class OptionsImpl extends Function {
  constructor() {
    super();
    return new Proxy(this, {
      apply: (target, thisArg, args): OptionsState => target._call(...args),
    });
  }
  get(key: keyof OptionsValues) {
    return useOptions.getState()[key];
  }
  _call(..._args: any): OptionsState {
    return useOptions.getState();
  }
}

export const Options: OptionsT = new OptionsImpl() as any;
