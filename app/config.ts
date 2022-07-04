import { NETWORK } from '@env';

export default {
  META1_CONNECTION_URL:
    NETWORK === 'TESTNET' ? 'https://api.test.meta-exchange.vision/ws' : 'https://api.meta-exchange.vision/ws',
  faucetAddress:
    NETWORK === 'TESTNET'
      ? 'https://faucet.dev.meta-exchange.vision/faucet'
      : 'https://faucet.meta-exchange.vision/faucet',
  litewalletApiHost:
    NETWORK === 'TESTNET'
      ? 'https://litewallet.dev.cryptomailsvc.io'
      : 'https://litewallet.cryptomailsvc.io',
  GatewayUrl:
    NETWORK === 'TESTNET'
      ? 'https://gateway.dev.meta-exchange.vision/api/wallet/init'
      : 'https://gateway.api.meta-exchange.vision/api/wallet/init',
};
