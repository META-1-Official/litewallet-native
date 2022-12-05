import { createSlice } from '@reduxjs/toolkit';
import config from '../../config';
import { login } from '../signIn/signIn.actions';
import { getAccountData } from './wallet.actions';

export interface WalletState {
  accountName: string;
  email: string;
  token: string;
  avatarUrl: string;
  isAuthorized: boolean;
  pending: boolean;
}

const initialState: WalletState = {
  accountName: '',
  email: '',
  token: '',
  avatarUrl: '',
  isAuthorized: false,
  pending: false,
};

const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(login.pending, state => {
      state.pending = true;
    });
    builder.addCase(login.fulfilled, (state, action) => {
      state.accountName = action.payload.accountName;
      state.email = action.payload.email;
      state.token = action.payload.token;
      state.isAuthorized = true;
      state.pending = false;
    });
    builder.addCase(login.rejected, state => {
      state.pending = false;
    });
    builder.addCase(getAccountData.fulfilled, (state, action) => {
      state.avatarUrl = `${config.LITE_WALLET_API_URL}/public/${action.payload.message.userAvatar}`;
    });
  },
});

export const {} = walletSlice.actions;
export default walletSlice.reducer;
