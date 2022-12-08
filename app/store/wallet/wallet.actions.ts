import { createAsyncThunk } from '@reduxjs/toolkit';
import { Asset } from 'react-native-image-picker';
import liteWalletServices from '../../services/litewallet.services';
import { RootState } from '../createStore';
import { login } from '../signIn/signIn.actions';

export const getAccountData = createAsyncThunk<any, undefined>(
  'wallet/getAccountData',
  async (_, thunkAPI) => {
    const rootState = thunkAPI.getState() as RootState;
    const accountName = rootState.wallet.accountName;
    const email = rootState.wallet.email;
    await thunkAPI.dispatch(login({ accountName, email }));
    return await liteWalletServices.getUserData(accountName);
  },
);

export const uploadAvatar = createAsyncThunk<any, { image: Asset }>(
  'wallet/uploadAvatar',
  async ({ image }, thunkAPI) => {
    const rootState = thunkAPI.getState() as RootState;
    const accountName = rootState.wallet.accountName;
    const email = rootState.wallet.email;
    await thunkAPI.dispatch(login({ accountName, email }));

    return await liteWalletServices.saveAvatar(accountName, image);
  },
);

export const deleteAvatar = createAsyncThunk<any, undefined>(
  'wallet/deleteAvatar',
  async (_, thunkAPI) => {
    const rootState = thunkAPI.getState() as RootState;
    const accountName = rootState.wallet.accountName;
    const email = rootState.wallet.email;
    await thunkAPI.dispatch(login({ accountName, email }));
    return await liteWalletServices.deleteAvatar(accountName);
  },
);

export const getNotifications = createAsyncThunk<any, undefined>(
  'wallet/getNotifications',
  async (_, thunkAPI) => {
    const rootState = thunkAPI.getState() as RootState;
    const accountName = rootState.wallet.accountName;
    const email = rootState.wallet.email;
    await thunkAPI.dispatch(login({ accountName, email }));
    return await liteWalletServices.getNotifications(accountName);
  },
);

export const getHistory = createAsyncThunk<any, { accountName: string, skipSize: number, from: string }>(
  'wallet/getHistory',
  async ({ accountName, skipSize, from }, thunkAPI) => {
    const rootState = thunkAPI.getState() as RootState;
    const currentAccountName = rootState.wallet.accountName;
    const email = rootState.wallet.email;
    await thunkAPI.dispatch(login({ accountName: currentAccountName, email }));
    return await liteWalletServices.getHistory(accountName, skipSize, from);
  },
);
