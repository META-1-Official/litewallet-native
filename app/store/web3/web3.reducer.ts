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
// todo: remove this and uncomment previous
// const initialState: Web3State = {
//   email: 'rocky-marciano@yopmail.com',
//   privateKey: '27177f7fda95c27eee70874eea228b36866d86341c9ba4912f29bdd781c2f128',
//   passKey: 'P5KZ427FkUnt2r3pD6AxR4tsVoLfCPfHLH3dFPaBUqZNSpUGZp8W',
//   pending: false,
// };

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
      state.pending = true;
    });
    builder.addCase(getWeb3User.fulfilled, (state, action) => {
      state.email = action.payload.email;
      state.privateKey = action.payload.privateKey;
      state.passKey = `P${PrivateKey.fromSeed(
        key.normalize_brainKey(`${action.payload.email}${action.payload.privateKey}`),
      ).toWif()}`;
      state.pending = false;
      console.log('PassKey: ', state.passKey);
    });
  },
});

export const { clearWeb3AuthData } = web3Slice.actions;
export default web3Slice.reducer;
