import { createAsyncThunk } from '@reduxjs/toolkit';
import { SdkLoginParams } from '@web3auth/react-native-sdk/src/types/sdk';
import { Buffer } from 'buffer';

import { web3Login } from '../../services/web3.services';
import { getPublicCompressed } from '../../utils/getPublicCompressed';

export const getWeb3User = createAsyncThunk<any, SdkLoginParams>(
  'signUp/web3Login',
  async options => {
    const response = await web3Login(options);
    console.log('getWeb3User: ', response);
    const appPubKey = getPublicCompressed(
      Buffer.from((response?.privKey || '').padStart(64, '0'), 'hex'),
    ).toString('hex');
    console.log('AppPublicKey: ', appPubKey);
    return {
      email: response?.userInfo?.email || '',
      privateKey: response.privKey || '',
      verifierId: response?.userInfo?.verifierId || '',
      idToken: response?.userInfo?.idToken || '',
      appPubKey,
    };
  },
);
