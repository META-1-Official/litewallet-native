import { createAsyncThunk } from '@reduxjs/toolkit';
import { SdkLoginParams } from '@web3auth/react-native-sdk/src/types/sdk';

import { web3Login } from '../../services/web3.services';

export const getWeb3User = createAsyncThunk<any, SdkLoginParams>(
  'signUp/web3Login',
  async options => {
    const response = await web3Login(options);
    console.log('getWeb3User: ', response);
    return {
      email: response?.userInfo?.email || '',
      privateKey: response.privKey || '',
      verifierId: response?.userInfo?.verifierId || '',
    };
  },
);
