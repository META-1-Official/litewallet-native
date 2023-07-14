import {
  NETWORK,
  TORUS_CLIENT_ID,
  ZENDESK_CHANNEL_KEY_ANDROID,
  ZENDESK_CHANNEL_KEY_IOS,
  SEND_X_API_KEY,
  SEND_X_TEAM_ID,
} from '@env';
import { OPENLOGIN_NETWORK } from '@web3auth/react-native-sdk';

enum Constants {
  META1_CONNECTION_URL = 'META1_CONNECTION_URL',
  FAUCET_URL = 'FAUCET_URL',
  LITE_WALLET_API_URL = 'LITE_WALLET_API_URL',
  GATEWAY_URL = 'GATEWAY_URL',
  API_URL = 'API_URL',
  WEB3_CLIENT_ID = 'WEB3_CLIENT_ID',
  WEB3_NETWORK = 'WEB3_NETWORK',
  FACE_KI_API_URL = 'FACE_KI_API_URL',
  E_SIGNATURE_API_URL = 'E_SIGNATURE_API_URL',
  APP_KEY_PREFIX = 'APP_KEY_PREFIX',
  CHANNEL_KEY_ANDROID = 'CHANNEL_KEY_ANDROID',
  CHANNEL_KEY_IOS = 'CHANNEL_KEY_IOS',
  SENDX_API_KEY = 'SENDX_API_KEY',
  SENDX_TEAM_ID = 'SENDX_TEAM_ID',
}

type NetworkConfig = Record<Constants, string>;

export enum Network {
  META1 = 'META1',
  META1DEV = 'META1DEV',
  META1TEST = 'META1TEST',
}

type Config = Record<Network, NetworkConfig>;

const config: Config = {
  META1: {
    META1_CONNECTION_URL: 'wss://maia.meta-exchange.vision/ws',
    FAUCET_URL: 'https://faucet.meta-exchange.vision/faucet',
    LITE_WALLET_API_URL: 'https://litewallet.cryptomailsvc.io',
    GATEWAY_URL: 'https://gateway.api.meta-exchange.vision',
    API_URL: 'https://api.meta-exchange.vision',
    WEB3_CLIENT_ID: TORUS_CLIENT_ID,
    WEB3_NETWORK: OPENLOGIN_NETWORK.MAINNET,
    FACE_KI_API_URL: 'https://litewallet.cryptomailsvc.io',
    E_SIGNATURE_API_URL: 'https://e-sign.cryptomailsvc.io',
    APP_KEY_PREFIX: 'META1',
    CHANNEL_KEY_ANDROID: ZENDESK_CHANNEL_KEY_ANDROID,
    CHANNEL_KEY_IOS: ZENDESK_CHANNEL_KEY_IOS,
    SENDX_API_KEY: SEND_X_API_KEY,
    SENDX_TEAM_ID: SEND_X_TEAM_ID,
  },
  META1DEV: {
    META1_CONNECTION_URL: 'wss://api.dev2.meta-exchange.vision/ws',
    FAUCET_URL: 'https://faucet.dev2.meta-exchange.vision/faucet',
    LITE_WALLET_API_URL: 'https://litewallet.dev2.cryptomailsvc.io',
    GATEWAY_URL: 'https://gateway.dev2.meta-exchange.vision',
    API_URL: 'https://api.dev2.meta-exchange.vision',
    WEB3_CLIENT_ID:
      'BFL8Z_Awr3p_ZVGiNUp1CIK8C28p0CC9WJRxw_GWEMWLJvOgJmpTJ8Xl8jbxYvzKhabmENF0GRbxE9EadEJ5T6g',
    WEB3_NETWORK: OPENLOGIN_NETWORK.TESTNET,
    FACE_KI_API_URL: 'https://litewallet.dev2.cryptomailsvc.io',
    E_SIGNATURE_API_URL: 'https://e-sign.dev.cryptomailsvc.io',
    APP_KEY_PREFIX: 'DEV11',
    CHANNEL_KEY_ANDROID: ZENDESK_CHANNEL_KEY_ANDROID,
    CHANNEL_KEY_IOS: ZENDESK_CHANNEL_KEY_IOS,
    SENDX_API_KEY: SEND_X_API_KEY,
    SENDX_TEAM_ID: SEND_X_TEAM_ID,
  },
  META1TEST: {
    META1_CONNECTION_URL: 'wss://api.test.meta-exchange.vision/ws',
    FAUCET_URL: 'https://faucet.test.meta-exchange.vision/faucet',
    LITE_WALLET_API_URL: 'https://litewallet.test.cryptomailsvc.io',
    GATEWAY_URL: 'https://gateway.test.meta-exchange.vision',
    API_URL: 'https://api.test.meta-exchange.vision',
    WEB3_CLIENT_ID:
      'BENfRWt5wyCFCi-nKzu6gIlPABHbvgub3lhZUhUp_r4XD2xmdph0MZMaXY89xnfPVs9wMao5vlBiA6dtP-4H1i0',
    WEB3_NETWORK: OPENLOGIN_NETWORK.TESTNET,
    FACE_KI_API_URL: 'https://litewallet.test.cryptomailsvc.io',
    E_SIGNATURE_API_URL: 'https://e-sign.test.cryptomailsvc.io',
    APP_KEY_PREFIX: 'TEST0',
    CHANNEL_KEY_ANDROID: '',
    CHANNEL_KEY_IOS: '',
    SENDX_API_KEY: SEND_X_API_KEY,
    SENDX_TEAM_ID: SEND_X_TEAM_ID,
  },
};

export default { ...config[NETWORK as Network] };
