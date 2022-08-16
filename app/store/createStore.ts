import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import faceKIReducer from './faceKI/faceKI.reducer';

export const createStore = configureStore({
  reducer: {
    faceKI: faceKIReducer,
  },
});

export type AppDispatch = typeof createStore.dispatch;
export type RootState = ReturnType<typeof createStore.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>;
