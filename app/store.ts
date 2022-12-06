import EncryptedStorage from 'react-native-encrypted-storage';
import create from 'zustand';
import { persist } from 'zustand/middleware';
import Omit from 'lodash.omit';

interface AppState {
  authorized: boolean;
  authorize: () => void;
  logout: () => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

export const useStore = create(
  persist<AppState>(
    set =>
      ({
        authorized: false,
        authorize: () => {
          set({
            authorized: true,
          });
        },
        logout: () => set({ authorized: false }),
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
