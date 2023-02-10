import { createSlice } from '@reduxjs/toolkit';
import { getWeb3User } from './web3.actions';
// @ts-ignore
import { PrivateKey, key } from 'meta1-vision-js';

interface Web3State {
  email: string;
  privateKey: string;
  passKey: string;
  verifierId: string;
  pending: boolean;
}

const initialState: Web3State = {
  email: '',
  privateKey: '',
  passKey: '',
  verifierId: '',
  pending: false,
};
// todo: remove this and uncomment previous
// const initialState: Web3State = {
//   email: 'user-x23@yopmail.com',
//   privateKey: '0a1abe5a5e7cd5ce1a2b61cab954530a46f23581103a5525bb3a8389d29d5a16',
//   passKey: 'P5K3iw2CNLfsY5tpYZJLxWop6YcCTan7wAe4tdZtAxZ7UmqJqtpk',
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
      state.verifierId = '';
      state.pending = true;
    });
    builder.addCase(getWeb3User.fulfilled, (state, action) => {
      state.email = action.payload.email;
      state.privateKey = action.payload.privateKey;
      state.passKey = `P${PrivateKey.fromSeed(
        key.normalize_brainKey(`${action.payload.email}${Date.now()}${action.payload.privateKey}`),
      ).toWif()}`;
      state.verifierId = action.payload.verifierId;
      state.pending = false;
      console.log('PassKey: ', state.passKey);
    });
  },
});

export const { clearWeb3AuthData } = web3Slice.actions;
export default web3Slice.reducer;
