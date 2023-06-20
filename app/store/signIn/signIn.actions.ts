import { createAsyncThunk } from '@reduxjs/toolkit';
import litewalletServices from '../../services/litewallet.services';

export const login = createAsyncThunk(
  'signIn/login',
  async ({
    accountName,
    email,
    idToken,
    appPubKey,
  }: {
    accountName: string;
    email: string;
    idToken: string;
    appPubKey: string;
  }) => {
    const account = await litewalletServices.login(accountName, email, idToken, appPubKey);
    account.email = email;
    return account;
  },
);
