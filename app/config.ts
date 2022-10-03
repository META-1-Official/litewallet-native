import { NETWORK } from '@env';

const isTestnet = NETWORK === 'TESTNET';

export default {
  META1_CONNECTION_URL: isTestnet
    ? 'wss://api.dev.meta-exchange.vision/ws'
    : 'wss://api.meta-exchange.vision/ws',
  faucetAddress: isTestnet
    ? 'https://faucet.dev.meta-exchange.vision/faucet'
    : 'https://faucet.meta-exchange.vision/faucet',
  liteWalletApiHost: isTestnet
    ? 'https://litewallet.dev.cryptomailsvc.io'
    : 'https://litewallet.cryptomailsvc.io',
  liteWalletOldApiHost: isTestnet
    ? 'https://litewallet.dev2.cryptomailsvc.io'
    : 'https://litewallet.cryptomailsvc.io',
  GatewayUrl: isTestnet
    ? 'https://gateway.dev.meta-exchange.vision'
    : 'https://gateway.api.meta-exchange.vision',
  API_URL: 'https://api.meta-exchange.vision',
  WEB3_CLIENT_ID:
    'BENfRWt5wyCFCi-nKzu6gIlPABHbvgub3lhZUhUp_r4XD2xmdph0MZMaXY89xnfPVs9wMao5vlBiA6dtP-4H1i0',
  FACE_KI_API_URL: isTestnet
    ? 'https://biometric.dev.cryptomailsvc.io'
    : 'https://biometric.dev.cryptomailsvc.io',
  E_SIGNATURE_API_URL: isTestnet
    ? 'https://e-sign.dev.cryptomailsvc.io'
    : 'https://humankyc.cryptomailsvc.io',
};
