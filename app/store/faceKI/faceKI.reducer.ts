import { createSlice } from '@reduxjs/toolkit';
import { enrollUser } from './faceKI.actions';
import { FaceKIState } from './faceKI.types';

const initialState: FaceKIState = {
  name: '',
  image: '',
  userList: undefined,
  userStatus: undefined,
  status: undefined,
};

export const faceKISlice = createSlice({
  name: 'faceKI',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(enrollUser.pending, (state) => {
        state.status = 'pending';
      })
      .addCase(enrollUser.fulfilled, (state, action) => {
        state.status = 'success';
        state.userStatus = action.payload.status;
      })
      .addCase(enrollUser.rejected, (state) => {
        state.status = 'error';
      });
  },
});

export default faceKISlice.reducer;
