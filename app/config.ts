import { NETWORK } from '@env';

enum URLs {
  META1_CONNECTION_URL = 'META1_CONNECTION_URL',
  FAUCET_URL = 'FAUCET_URL',
  LITE_WALLET_API_URL = 'LITE_WALLET_API_URL',
  GATEWAY_URL = 'GATEWAY_URL',
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
    FAUCET_URL: 'https://faucet.meta-exchange.vision/faucet',
    LITE_WALLET_API_URL: 'https://litewallet.cryptomailsvc.io',
    GATEWAY_URL: 'https://gateway.api.meta-exchange.vision',
    API_URL: 'https://api.meta-exchange.vision',
    WEB3_CLIENT_ID:
      'BENfRWt5wyCFCi-nKzu6gIlPABHbvgub3lhZUhUp_r4XD2xmdph0MZMaXY89xnfPVs9wMao5vlBiA6dtP-4H1i0',
    FACE_KI_API_URL: 'https://biometric.dev.cryptomailsvc.io',
    E_SIGNATURE_API_URL: 'https://humankyc.cryptomailsvc.io',
  },
  META1DEV: {
    META1_CONNECTION_URL: 'wss://api.dev.meta-exchange.vision/ws',
    FAUCET_URL: 'https://faucet.dev.meta-exchange.vision/faucet',
    LITE_WALLET_API_URL: 'https://litewallet.dev.cryptomailsvc.io',
    GATEWAY_URL: 'https://gateway.dev.meta-exchange.vision',
    API_URL: 'https://api.meta-exchange.vision',
    WEB3_CLIENT_ID:
      'BENfRWt5wyCFCi-nKzu6gIlPABHbvgub3lhZUhUp_r4XD2xmdph0MZMaXY89xnfPVs9wMao5vlBiA6dtP-4H1i0',
    FACE_KI_API_URL: 'https://biometric.dev.cryptomailsvc.io',
    E_SIGNATURE_API_URL: 'https://e-sign.dev.cryptomailsvc.io',
  },
  META1DEV2: {
    META1_CONNECTION_URL: 'wss://api.dev2.meta-exchange.vision/ws',
    FAUCET_URL: 'https://faucet.dev2.meta-exchange.vision/faucet',
    LITE_WALLET_API_URL: 'https://litewallet.dev2.cryptomailsvc.io',
    GATEWAY_URL: 'https://gateway.dev2.meta-exchange.vision',
    API_URL: 'https://api.meta-exchange.vision',
    WEB3_CLIENT_ID:
      'BENfRWt5wyCFCi-nKzu6gIlPABHbvgub3lhZUhUp_r4XD2xmdph0MZMaXY89xnfPVs9wMao5vlBiA6dtP-4H1i0',
    FACE_KI_API_URL: 'https://biometric.dev.cryptomailsvc.io',
    E_SIGNATURE_API_URL: 'https://e-sign.dev.cryptomailsvc.io',
  },
  META1TEST: {
    META1_CONNECTION_URL: 'wss://api.test.meta-exchange.vision/ws',
    FAUCET_URL: 'https://faucet.test.meta-exchange.vision/faucet',
    LITE_WALLET_API_URL: 'https://litewallet.test.cryptomailsvc.io',
    GATEWAY_URL: 'https://gateway.test.meta-exchange.vision',
    API_URL: 'https://api.test.meta-exchange.vision',
    WEB3_CLIENT_ID:
      'BENfRWt5wyCFCi-nKzu6gIlPABHbvgub3lhZUhUp_r4XD2xmdph0MZMaXY89xnfPVs9wMao5vlBiA6dtP-4H1i0',
    FACE_KI_API_URL: 'https://biometric.test.cryptomailsvc.io',
    E_SIGNATURE_API_URL: 'https://e-sign.test.cryptomailsvc.io',
  },
};

export default { ...config[NETWORK as Network] };
