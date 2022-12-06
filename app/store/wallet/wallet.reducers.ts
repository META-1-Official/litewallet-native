import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import config from '../../config';
import { Notification } from '../../services/litewallet.services';
import { login } from '../signIn/signIn.actions';
import { deleteAvatar, getAccountData, uploadAvatar } from './wallet.actions';

export interface WalletState {
  accountName: string;
  email: string;
  password: string;
  token: string;
  avatarUrl: string;
  notifications?: Notification[];
  isAuthorized: boolean;
  pending: boolean;
}

const initialState: WalletState = {
  accountName: '',
  email: '',
  password: '',
  token: '',
  avatarUrl: '',
  notifications: undefined,
  isAuthorized: false,
  pending: false,
};
// todo: remove this and uncomment previous
// const initialState: WalletState = {
//   accountName: 'user-x21',
//   email: 'user-x21@yopmail.com',
//   password: '',
//   token: '',
//   avatarUrl: '',
//   notifications: undefined,
//   isAuthorized: true,
//   pending: false,
// };

const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    authorize: (state, action: PayloadAction<Partial<WalletState>>) => {
      state.accountName = action.payload.accountName || '';
      state.email = action.payload.email || '';
      state.token = action.payload.token || '';
    },
    logout: () => {
      return { ...initialState };
    },
  },
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
    builder.addCase(uploadAvatar.fulfilled, (state, action) => {
      state.avatarUrl = `${config.LITE_WALLET_API_URL}/public/${action.payload.message}`;
    });
    builder.addCase(deleteAvatar.fulfilled, state => {
      state.avatarUrl = '';
    });
  },
});

export const { authorize, logout } = walletSlice.actions;
export default walletSlice.reducer;
