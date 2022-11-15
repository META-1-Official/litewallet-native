import storage from 'redux-persist/lib/storage';
import { persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import { configureStore, ThunkAction, Action, combineReducers } from '@reduxjs/toolkit';
import faceKIReducer from './faceKI/faceKI.reducer';
import signInReducer from './signIn/signIn.reducer';
import signUpReducer from './signUp/signUp.reducer';
import web3Reducer from './web3/web3.reducer';
import eSignature from './eSignature/eSignature.reducer';

const reducers = combineReducers({
  signIn: signInReducer,
  signUp: signUpReducer,
  web3: web3Reducer,
  faceKI: faceKIReducer,
  eSignature: eSignature,
});

const persistConfig = {
  key: 'root',
  storage,
};

const persistedReducer = persistReducer(persistConfig, reducers);

export const createStore = configureStore({
  reducer: persistedReducer,
  devTools: true,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export type AppDispatch = typeof createStore.dispatch;
export type RootState = ReturnType<typeof createStore.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
