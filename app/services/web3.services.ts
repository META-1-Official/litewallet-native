import * as WebBrowser from '@toruslabs/react-native-web-browser';
import Web3Auth, { LOGIN_PROVIDER, OPENLOGIN_NETWORK, State } from '@web3auth/react-native-sdk';
import { SdkLoginParams } from '@web3auth/react-native-sdk/src/types/sdk';
import config from '../config';

const resolvedRedirectUrl = 'io.meta1.appbeta://auth';

const web3auth = new Web3Auth(WebBrowser, {
  clientId: config.WEB3_CLIENT_ID,
  network: OPENLOGIN_NETWORK.TESTNET,
});

export const web3Login = (options: SdkLoginParams): Promise<State> => {
  return web3auth.login({
    ...options,
    redirectUrl: resolvedRedirectUrl,
  });
};
