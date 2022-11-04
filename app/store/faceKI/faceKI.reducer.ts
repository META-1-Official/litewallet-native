import { createSlice } from '@reduxjs/toolkit';
import { faceKIVerify } from './faceKI.actions';

interface SignInState {
  faceKIStatus: string;
  image: string;
  pending: boolean;
}

const initialState: SignInState = {
  faceKIStatus: '',
  image: '',
  pending: false,
};

const faceKISlice = createSlice({
  name: 'signIn',
  initialState,
  reducers: {
    clearFaceKI: () => {
      return { ...initialState };
    },
  },
  extraReducers: builder => {
    builder.addCase(faceKIVerify.pending, state => {
      state.pending = true;
    });
    builder.addCase(faceKIVerify.fulfilled, (state, action) => {
      state.faceKIStatus = action.payload.status;
      state.image = action.payload.image;
    });
    builder.addCase(faceKIVerify.rejected, state => {
      state.faceKIStatus = 'error';
      state.image = '';
    });
  },
});

export const { clearFaceKI } = faceKISlice.actions;
export default faceKISlice.reducer;
