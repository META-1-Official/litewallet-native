import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import {
  faceKIVerifyOnSignup,
  faceKIVerifyOnSignIn,
  getFASToken,
  getFASMigrationStatus,
  fasEnroll,
} from './faceKI.actions';

interface FaceKIState {
  faceKIStatus: string;
  image: string;
  pending: boolean;
  message: string;
  token: string;
  fasToken: string;
}

const initialState: FaceKIState = {
  faceKIStatus: '',
  image: '',
  pending: false,
  message: '',
  token: '',
  fasToken: '',
};

const faceKISlice = createSlice({
  name: 'faceKI',
  initialState,
  reducers: {
    clearFaceKI: () => {
      console.log('Clear faceKIState');
      return { ...initialState };
    },
    setFasToken: (state, action: PayloadAction<string>) => {
      state.fasToken = action.payload;
    },
  },
  extraReducers: builder => {
    builder.addCase(getFASMigrationStatus.pending, state => {
      state.pending = true;
    });
    builder.addCase(getFASMigrationStatus.rejected, state => {
      state.pending = false;
    });
    builder.addCase(getFASToken.pending, state => {
      state.pending = true;
    });
    builder.addCase(getFASToken.fulfilled, (state, action) => {
      state.pending = false;
      state.message = action.payload.message;
      if (action.payload.token) {
        state.token = action.payload.token;
      }
    });
    builder.addCase(getFASToken.rejected, state => {
      state.pending = true;
    });
    builder.addCase(fasEnroll.pending, state => {
      state.pending = true;
    });
    builder.addCase(fasEnroll.fulfilled, state => {
      state.pending = false;
    });
    builder.addCase(fasEnroll.rejected, state => {
      state.pending = false;
    });
    //---------------------------------------------------------------------------------------
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

export const { clearFaceKI, setFasToken } = faceKISlice.actions;
export default faceKISlice.reducer;
