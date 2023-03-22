import * as WebBrowser from '@toruslabs/react-native-web-browser';
import Web3Auth, { OPENLOGIN_NETWORK_TYPE, State } from '@web3auth/react-native-sdk';
import { SdkLoginParams } from '@web3auth/react-native-sdk/src/types/sdk';
import config from '../config';

const resolvedRedirectUrl = 'io.meta1.appbeta://auth';

const web3auth = new Web3Auth(WebBrowser, {
  clientId: config.WEB3_CLIENT_ID,
  network: config.WEB3_NETWORK as OPENLOGIN_NETWORK_TYPE,
  whiteLabel: {
    name: 'META1',
  },
});

export const web3Login = (options: SdkLoginParams): Promise<State> => {
  return web3auth.login({
    ...options,
    redirectUrl: resolvedRedirectUrl,
  });
};
