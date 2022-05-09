import { NETWORK } from '@env';

export default {
  META1_CONNECTION_URL:
    NETWORK === 'TESTNET' ? 'wss://maia.dev.meta1.io/ws' : 'wss://maia.meta1.io/ws',
  faucetAddress:
    NETWORK === 'TESTNET'
      ? 'https://faucet.dev.meta1.io/faucet'
      : 'https://faucet.meta1.io/faucet',
  litewalletApiHost:
    NETWORK === 'TESTNET'
      ? 'https://litewallet.dev.cryptomailsvc.io'
      : 'https://litewallet.cryptomailsvc.io',
  GatewayUrl:
    NETWORK === 'TESTNET'
      ? 'https://gateway.dev.meta1.io/api/wallet/init'
      : 'https://gateway.api.meta1.io/api/wallet/init',
  AppBackendUrl: 'http://65.21.242.70:3333',
};
