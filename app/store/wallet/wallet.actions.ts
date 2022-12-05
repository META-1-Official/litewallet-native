import { createAsyncThunk } from '@reduxjs/toolkit';
import litewalletServices from '../../services/litewallet.services';
import { RootState } from '../createStore';
import { login } from '../signIn/signIn.actions';

export const getAccountData = createAsyncThunk<any, undefined>(
  'wallet/getAccountData',
  async (_, thunkAPI) => {
    const rootState = thunkAPI.getState() as RootState;
    const accountName = rootState.wallet.accountName;
    const email = rootState.wallet.email;
    await thunkAPI.dispatch(login({ accountName, email }));
    return await litewalletServices.getUserData(accountName);
  },
);
