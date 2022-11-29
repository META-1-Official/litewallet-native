import { NETWORK, FACE_KI_CLIENT_SECRET, FACE_KI_PASSWORD } from '@env';

enum URLs {
  META1_CONNECTION_URL = 'META1_CONNECTION_URL',
  faucetAddress = 'faucetAddress',
  liteWalletApiHost = 'liteWalletApiHost',
  GatewayUrl = 'GatewayUrl',
  API_URL = 'API_URL',
  WEB3_CLIENT_ID = 'WEB3_CLIENT_ID',
  FACE_KI_API_URL = 'FACE_KI_API_URL',
  E_SIGNATURE_API_URL = 'E_SIGNATURE_API_URL',
}

type NetworkConfig = Record<URLs, string>;

export enum Network {
  META1 = 'META1',
  META1DEV = 'META1DEV',
  META1DEV2 = 'META1DEV2',
  META1TEST = 'META1TEST',
}

type Config = Record<Network, NetworkConfig>;

const config: Config = {
  META1: {
    META1_CONNECTION_URL: 'wss://api.meta-exchange.vision/ws',
    faucetAddress: 'https://faucet.meta-exchange.vision/faucet',
    liteWalletApiHost: 'https://litewallet.cryptomailsvc.io',
    GatewayUrl: 'https://gateway.api.meta-exchange.vision',
    API_URL: 'https://api.meta-exchange.vision',
    WEB3_CLIENT_ID:
      'BENfRWt5wyCFCi-nKzu6gIlPABHbvgub3lhZUhUp_r4XD2xmdph0MZMaXY89xnfPVs9wMao5vlBiA6dtP-4H1i0',
    FACE_KI_API_URL: 'https://biometric.dev.cryptomailsvc.io',
    E_SIGNATURE_API_URL: 'https://humankyc.cryptomailsvc.io',
  },
  META1DEV: {
    META1_CONNECTION_URL: 'wss://api.dev.meta-exchange.vision/ws',
    faucetAddress: 'https://faucet.dev.meta-exchange.vision/faucet',
    liteWalletApiHost: 'https://litewallet.dev.cryptomailsvc.io',
    GatewayUrl: 'https://gateway.dev.meta-exchange.vision',
    API_URL: 'https://api.meta-exchange.vision',
    WEB3_CLIENT_ID:
      'BENfRWt5wyCFCi-nKzu6gIlPABHbvgub3lhZUhUp_r4XD2xmdph0MZMaXY89xnfPVs9wMao5vlBiA6dtP-4H1i0',
    FACE_KI_API_URL: 'https://biometric.dev.cryptomailsvc.io',
    E_SIGNATURE_API_URL: 'https://e-sign.dev.cryptomailsvc.io',
  },
  META1DEV2: {
    META1_CONNECTION_URL: 'wss://api.dev2.meta-exchange.vision/ws',
    faucetAddress: 'https://faucet.dev2.meta-exchange.vision/faucet',
    liteWalletApiHost: 'https://litewallet.dev2.cryptomailsvc.io',
    GatewayUrl: 'https://gateway.dev2.meta-exchange.vision',
    API_URL: 'https://api.meta-exchange.vision',
    WEB3_CLIENT_ID:
      'BENfRWt5wyCFCi-nKzu6gIlPABHbvgub3lhZUhUp_r4XD2xmdph0MZMaXY89xnfPVs9wMao5vlBiA6dtP-4H1i0',
    FACE_KI_API_URL: 'https://biometric.dev.cryptomailsvc.io',
    E_SIGNATURE_API_URL: 'https://e-sign.dev.cryptomailsvc.io',
  },
  META1TEST: {
    META1_CONNECTION_URL: 'wss://api.test.meta-exchange.vision/ws',
    faucetAddress: 'https://faucet.test.meta-exchange.vision/faucet',
    liteWalletApiHost: 'https://litewallet.test.cryptomailsvc.io',
    GatewayUrl: 'https://gateway.test.meta-exchange.vision',
    API_URL: 'https://api.test.meta-exchange.vision',
    WEB3_CLIENT_ID:
      'BENfRWt5wyCFCi-nKzu6gIlPABHbvgub3lhZUhUp_r4XD2xmdph0MZMaXY89xnfPVs9wMao5vlBiA6dtP-4H1i0',
    FACE_KI_API_URL: 'https://biometric.test.cryptomailsvc.io',
    E_SIGNATURE_API_URL: 'https://e-sign.test.cryptomailsvc.io',
  },
};

const secrets = {
  faceKi: {
    clientSecret: FACE_KI_CLIENT_SECRET,
    password: FACE_KI_PASSWORD,
  },
};

export default { ...config[NETWORK as Network], secrets };
