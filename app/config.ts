import { NETWORK } from '@env';

export default {
  META1_CONNECTION_URL:
    NETWORK === 'TESTNET'
      ? 'wss://api.test.meta-exchange.vision/ws'
      : 'wss://api.meta-exchange.vision/ws',
  faucetAddress:
    NETWORK === 'TESTNET'
      ? 'https://faucet.dev.meta-exchange.vision/faucet'
      : 'https://faucet.meta-exchange.vision/faucet',
  liteWalletApiHost:
    NETWORK === 'TESTNET'
      ? 'https://litewallet.dev.cryptomailsvc.io'
      : 'https://litewallet.cryptomailsvc.io',
  GatewayUrl:
    NETWORK === 'TESTNET'
      ? 'https://gateway.dev.meta-exchange.vision'
      : 'https://gateway.api.meta-exchange.vision',
  API_URL: 'https://api.meta-exchange.vision',
  WEB3_CLIENT_ID:
    'BENfRWt5wyCFCi-nKzu6gIlPABHbvgub3lhZUhUp_r4XD2xmdph0MZMaXY89xnfPVs9wMao5vlBiA6dtP-4H1i0',
};
