import { createAsyncThunk } from '@reduxjs/toolkit';
import litewalletServices from '../../services/litewallet.services';

export const login = createAsyncThunk(
  'signIn/login',
  async ({
    accountName,
    email,
    idToken,
    appPubKey,
    fasToken,
  }: {
    accountName: string;
    email: string;
    idToken: string;
    appPubKey: string;
    fasToken: string;
  }) => {
    const account = await litewalletServices.login(
      accountName,
      email,
      idToken,
      appPubKey,
      fasToken,
    );
    account.email = email;
    return account;
  },
);
