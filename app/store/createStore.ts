import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import signUpReducer from './signUp/signUp.reducer';

export const createStore = configureStore({
  reducer: {
    signUp: signUpReducer,
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
