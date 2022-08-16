import { RootState } from '../createStore';

export const faceKIState = (state: RootState) => state.faceKI;

export const statusSelector = (state: RootState) => state.faceKI.status;
export const pageSelector = (state: RootState) => state.faceKI.userStatus;
