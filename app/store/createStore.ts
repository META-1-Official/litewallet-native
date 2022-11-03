import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import faceKIReducer from './faceKI/faceKI.reducer';
import signInReducer from './signIn/signIn.reducer';
import signUpReducer from './signUp/signUp.reducer';
import web3Reducer from './web3/web3.reducer';

export const createStore = configureStore({
  reducer: {
    signIn: signInReducer,
    signUp: signUpReducer,
    web3: web3Reducer,
    faceKI: faceKIReducer,
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
