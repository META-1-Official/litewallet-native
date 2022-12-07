import { createSlice } from '@reduxjs/toolkit';
import { faceKIVerifyOnSignup, faceKIVerifyOnSignIn } from './faceKI.actions';

interface FaceKIState {
  faceKIStatus: string;
  image: string;
  pending: boolean;
}

const initialState: FaceKIState = {
  faceKIStatus: '',
  image: '',
  pending: false,
};
// todo: remove this and uncomment previous
// const initialState: FaceKIState = {
//   faceKIStatus: 'Enroll OK',
//   image: '',
//   pending: false,
// };

const faceKISlice = createSlice({
  name: 'faceKI',
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
    builder.addCase(faceKIVerifyOnSignIn.pending, state => {
      state.pending = true;
    });
    builder.addCase(faceKIVerifyOnSignIn.fulfilled, (state, action) => {
      state.faceKIStatus = action.payload.status;
      state.image = action.payload.image;
    });
    builder.addCase(faceKIVerifyOnSignIn.rejected, state => {
      state.faceKIStatus = 'error';
      state.image = '';
    });
  },
});

export const { clearFaceKI } = faceKISlice.actions;
export default faceKISlice.reducer;
