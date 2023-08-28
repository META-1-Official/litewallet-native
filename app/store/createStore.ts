import AsyncStorage from '@react-native-async-storage/async-storage';
import createDebugger from 'redux-flipper';
import { persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import { configureStore, ThunkAction, Action, combineReducers } from '@reduxjs/toolkit';
import faceKIReducer from './faceKI/faceKI.reducer';
import signInReducer from './signIn/signIn.reducer';
import signUpReducer from './signUp/signUp.reducer';
import web3Reducer from './web3/web3.reducer';
import eSignatureReducer from './eSignature/eSignature.reducer';
import walletReducer from './wallet/wallet.reducers';
import dexReducer from './dex/dex.reducer';

const reducers = combineReducers({
  signIn: signInReducer,
  signUp: signUpReducer,
  web3: web3Reducer,
  faceKI: faceKIReducer,
  eSignature: eSignatureReducer,
  wallet: walletReducer,
  dex: dexReducer,
});

const reducersToPersist = ['signIn', 'signUp', 'web3', 'faceKI', 'wallet', 'eSignature'];

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: reducersToPersist,
};

const persistedReducer = persistReducer(persistConfig, reducers);

const otherMiddlewares: Array<any> = [];

if (__DEV__) {
  otherMiddlewares.push(createDebugger());
}

export const createStore = configureStore({
  reducer: persistedReducer,
  devTools: true,
  middleware: getDefaultMiddleware => {
    const middlewares = getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    });

    return middlewares.concat(otherMiddlewares);
  },
});

export type AppDispatch = typeof createStore.dispatch;
export type RootState = ReturnType<typeof createStore.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
