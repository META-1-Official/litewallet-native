import { createSlice } from '@reduxjs/toolkit';
import { getWeb3User } from './web3.actions';
// @ts-ignore
import { PrivateKey, key } from 'meta1-vision-js';

interface Web3State {
  email: string;
  privateKey: string;
  passKey: string;
  verifierId: string;
  idToken: string;
  appPubKey: string;
  pending: boolean;
}

const initialState: Web3State = {
  email: '',
  privateKey: '',
  passKey: '',
  verifierId: '',
  idToken: '',
  appPubKey: '',
  pending: false,
};

const web3Slice = createSlice({
  name: 'web3',
  initialState,
  reducers: {
    clearWeb3AuthData: () => {
      console.log('Clear web3AuthState');
      return { ...initialState };
    },
  },
  extraReducers: builder => {
    builder.addCase(getWeb3User.pending, state => {
      state.email = '';
      state.privateKey = '';
      state.passKey = '';
      state.verifierId = '';
      state.idToken = '';
      state.appPubKey = '';
      state.pending = true;
    });
    builder.addCase(getWeb3User.fulfilled, (state, action) => {
      state.email = action.payload.email;
      state.privateKey = action.payload.privateKey;
      state.passKey = `P${PrivateKey.fromSeed(
        key.normalize_brainKey(`${action.payload.email}${Date.now()}${action.payload.privateKey}`),
      ).toWif()}`;
      state.verifierId = action.payload.verifierId;
      state.idToken = action.payload.idToken;
      state.appPubKey = action.payload.appPubKey;
      state.pending = false;
      console.log('PassKey: ', state.passKey);
    });
  },
});

export const { clearWeb3AuthData } = web3Slice.actions;
export default web3Slice.reducer;
