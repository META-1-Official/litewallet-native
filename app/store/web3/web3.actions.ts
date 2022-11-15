import { createAsyncThunk } from '@reduxjs/toolkit';
import { LOGIN_PROVIDER } from '@web3auth/react-native-sdk';
import { web3Login } from '../../services/web3.services';

export interface Web3UserParams {
  provider: keyof typeof LOGIN_PROVIDER;
}

export const getWeb3User = createAsyncThunk(
  'signUp/web3Login',
  async ({ provider }: Web3UserParams) => {
    const response = await web3Login(provider);
    console.log('getWeb3User: ', response);
    return { email: response?.userInfo?.email || '', privateKey: response.privKey || '' };
  },
);
