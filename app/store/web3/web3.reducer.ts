import { createSlice } from '@reduxjs/toolkit';
import { getWeb3User } from './web3.actions';
// @ts-ignore
import { PrivateKey, key } from 'meta1-vision-js';

interface Web3State {
  email: string;
  privateKey: string;
  passKey: string;
  pending: boolean;
}

const initialState: Web3State = {
  email: '',
  privateKey: '',
  passKey: '',
  pending: false,
};

const web3Slice = createSlice({
  name: 'signIn',
  initialState,
  reducers: {
    clearWeb3AuthData: () => {
      return { ...initialState };
    },
  },
  extraReducers: builder => {
    builder.addCase(getWeb3User.pending, state => {
      state.email = '';
      state.privateKey = '';
      state.passKey = '';
      state.pending = true;
    });
    builder.addCase(getWeb3User.fulfilled, (state, action) => {
      state.email = action.payload.email;
      state.privateKey = action.payload.privateKey;
      state.passKey = `P${PrivateKey.fromSeed(
        key.normalize_brainKey(`${action.payload.email}${action.payload.privateKey}`),
      ).toWif()}`;
      state.pending = false;
    });
  },
});

export const { clearWeb3AuthData } = web3Slice.actions;
export default web3Slice.reducer;
