import { createSlice } from '@reduxjs/toolkit';
import { faceKIVerifyOnSignup, faceKIVerifyOnSignIn, faceKIAuth } from './faceKI.actions';

interface FaceKIState {
  faceKIStatus: string;
  image: string;
  authToken: string;
  pending: boolean;
}

const initialState: FaceKIState = {
  faceKIStatus: '',
  image: '',
  authToken: '',
  pending: false,
};

const faceKISlice = createSlice({
  name: 'faceKI',
  initialState,
  reducers: {
    clearFaceKI: state => {
      console.log('Clear faceKIState');
      return { ...initialState, authToken: state.authToken };
    },
  },
  extraReducers: builder => {
    builder.addCase(faceKIAuth.fulfilled, (state, action) => {
      state.authToken = action.payload.token;
    });
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
