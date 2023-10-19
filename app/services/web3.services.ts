import { MFA_LEVELS } from '@toruslabs/openlogin/src/constants';
import * as WebBrowser from '@toruslabs/react-native-web-browser';
import Web3Auth, { OPENLOGIN_NETWORK_TYPE } from '@web3auth/react-native-sdk';
import EncryptedStorage from 'react-native-encrypted-storage';
import { SdkLoginParams } from '@web3auth/react-native-sdk/src/types/interface';
import config from '../config';

const resolvedRedirectUrl = 'io.meta1.appbeta://auth';

const web3auth: Web3Auth = new Web3Auth(WebBrowser, EncryptedStorage, {
  clientId: config.WEB3_CLIENT_ID,
  network: config.WEB3_NETWORK as OPENLOGIN_NETWORK_TYPE,
  redirectUrl: resolvedRedirectUrl,
  whiteLabel: {
    appName: 'META1',
    logoLight: 'https://pbs.twimg.com/profile_images/980143928769839105/hK3RnAff_400x400.jpg',
    defaultLanguage: 'en',
  },
});

export const web3Login = async (options: SdkLoginParams): Promise<Web3Auth> => {
  await web3auth.init();
  await web3auth.login({
    ...options,
    mfaLevel: MFA_LEVELS.NONE,
    redirectUrl: resolvedRedirectUrl,
    extraLoginOptions: {
      ...options.extraLoginOptions,
      redirect_uri: resolvedRedirectUrl,
    },
  });
  return web3auth;
};
