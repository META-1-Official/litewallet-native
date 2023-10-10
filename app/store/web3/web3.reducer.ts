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
  email: 'alex-30@yopmail.com',
  privateKey: '2df0cff12d933f62753211dce896e762a377a5ed687eafbd023afc0ce7410c81',
  passKey: 'P5KUf8M3zU1Zko7dCC4q21Lw69AxTFuAD6QWCEBUvvFdmBtU2p6X',
  verifierId: 'alex-30@yopmail.com',
  idToken:
    'eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IlRZT2dnXy01RU9FYmxhWS1WVlJZcVZhREFncHRuZktWNDUzNU1aUEMwdzAifQ.eyJpYXQiOjE2OTYzMzk4NDUsImF1ZCI6IkJGTDhaX0F3cjNwX1pWR2lOVXAxQ0lLOEMyOHAwQ0M5V0pSeHdfR1dFTVdMSnZPZ0ptcFRKOFhsOGpieFl2ektoYWJtRU5GMEdSYnhFOUVhZEVKNVQ2ZyIsIm5vbmNlIjoiMDIwZDkwNjQyZjlhZjUzODA3YjI0M2IxN2UyZTgyNzhiMTlhYTU1MTM4NGY3Yzk3YmNhM2QzN2I0MTFhODQ2YjVmIiwiaXNzIjoiaHR0cHM6Ly9hcGktYXV0aC53ZWIzYXV0aC5pbyIsIndhbGxldHMiOlt7InB1YmxpY19rZXkiOiIwMmVjYWFkZGYyZjFjZjIyOTg2NjE1YjA5Nzg5OTgyYTNiM2E2MzE3MWUyMmIyMDFhZDg2ZjdjYjY5NmZmNjJmNGUiLCJ0eXBlIjoid2ViM2F1dGhfYXBwX2tleSIsImN1cnZlIjoic2VjcDI1NmsxIn1dLCJlbWFpbCI6ImFsZXgtMzBAeW9wbWFpbC5jb20iLCJuYW1lIjoiYWxleC0zMEB5b3BtYWlsLmNvbSIsInZlcmlmaWVyIjoidG9ydXMiLCJ2ZXJpZmllcklkIjoiYWxleC0zMEB5b3BtYWlsLmNvbSIsImFnZ3JlZ2F0ZVZlcmlmaWVyIjoidGtleS1hdXRoMC1lbWFpbC1wYXNzd29yZGxlc3MtbHJjIiwiZXhwIjoxNjk2NDI2MjQ1fQ.HUmgDTyTC6TINLEstYAiLuNeV_YFNQ06iypj9V6KU9aPa8xpQob_aHE3E2gPT4-vDJ4t56chZmW9Y9g6ZDTN2A',
  appPubKey: '02ecaaddf2f1cf22986615b09789982a3b3a63171e22b201ad86f7cb696ff62f4e',
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
