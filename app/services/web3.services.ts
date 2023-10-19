import * as WebBrowser from '@toruslabs/react-native-web-browser';
import Web3Auth, { OPENLOGIN_NETWORK_TYPE } from '@web3auth/react-native-sdk';
import EncryptedStorage from 'react-native-encrypted-storage';
import { SdkLoginParams } from '@web3auth/react-native-sdk/src/types/interface';
import config from '../config';

const resolvedRedirectUrl = 'io.meta1.appbeta://auth';

const web3auth: Web3Auth = new Web3Auth(WebBrowser, EncryptedStorage, {
  clientId: config.WEB3_CLIENT_ID,
  network: config.WEB3_NETWORK as OPENLOGIN_NETWORK_TYPE,
  whiteLabel: {
    // issue in @web3auth package | it should be `name` instead of `appName` here
    name: 'META1',
  },
});

export const web3Login = async (options: SdkLoginParams): Promise<Web3Auth> => {
  await web3auth.init();
  await web3auth.login({
    ...options,
    redirectUrl: resolvedRedirectUrl,
  });
  return web3auth;
};
