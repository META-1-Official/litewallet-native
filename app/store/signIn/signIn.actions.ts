import { createAsyncThunk } from '@reduxjs/toolkit';
import litewalletServices from '../../services/litewallet.services';

export const login = createAsyncThunk(
  'signIn/login',
  async ({ accountName, email }: { accountName: string; email: string }) => {
    const account = await litewalletServices.login(accountName, email);
    account.email = email;
    return account;
  },
);
