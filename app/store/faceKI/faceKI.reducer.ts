import { createSlice } from '@reduxjs/toolkit';
import { faceKIVerifyOnSignup } from './faceKI.actions';

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
      console.log('Clear faceKIState');
      return { ...initialState };
    },
  },
  extraReducers: builder => {
    builder.addCase(faceKIVerifyOnSignup.pending, state => {
      state.pending = true;
    });
    builder.addCase(faceKIVerifyOnSignup.fulfilled, (state, action) => {
      state.faceKIStatus = action.payload.status;
      state.image = action.payload.image;
    });
    builder.addCase(faceKIVerifyOnSignup.rejected, state => {
      state.faceKIStatus = 'error';
      state.image = '';
    });
  },
});

export const { clearFaceKI } = faceKISlice.actions;
export default faceKISlice.reducer;
