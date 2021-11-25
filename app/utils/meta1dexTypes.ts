import { ArrayMap } from '.';

export interface iAccount {
  id: string;
  membership_expiration_date: string;
  registrar: string;
  referrer: string;
  lifetime_referrer: string;
  network_fee_percentage: number;
  lifetime_referrer_fee_percentage: number;
  referrer_rewards_percentage: number;
  name: string;
  owner: {
    weight_threshold: number;
    key_auths: any[];
  };
  active: {
    weight_threshold: number;
    key_auths: any[];
  };
  options: {
    memo_key: string;
    voting_account: string;
    num_witness: number;
    num_committee: number;
  };
  statistics: string;
  owner_special_authority: any[]; // Nonuniformly typed array
  active_special_authority: any[]; // Nonuniformly typed array
  top_n_control_flags: number;
}

export interface iBalance {
  id: string;
  owner: string;
  /** Aka asset_id
   * @see {@link iAsset.id}
   */
  asset_type: string;
  balance: number;
  maintenance_flag: boolean;
}

export interface iLimitOrder {
  id: string;
  expiration: string;
  seller: string;
  for_sale: number;
  sell_price: {
    base: {
      amount: number;
      asset_id: string;
    };
    quote: {
      amount: number;
      asset_id: string;
    };
  };
  deferred_fee: number;
  deferred_paid_fee: {
    amount: number;
    asset_id: string;
  };
}
export interface iWithdrawsFrom {
  id: string;
  withdraw_from_account: string;
  authorized_account: string;
  withdrawal_limit: {
    amount: number;
    asset_id: string;
  };
  withdrawal_period_sec: number;
  period_start_time: string;
  expiration: string;
  claimed_this_period: number;
}

export interface iOptionalData {
  balances: boolean;
  vesting_balances: boolean;
  limit_orders: boolean;
  call_orders: boolean;
  settle_orders: boolean;
  proposals: boolean;
  assets: boolean;
  withdraws_from: boolean;
  withdraws_to: boolean;
  htlcs_from: boolean;
  htlcs_to: boolean;
}

export interface fullAccount {
  account: iAccount;
  registrar_name: string;
  referrer_name: string;
  lifetime_referrer_name: string;
  balances: iBalance[];
  limit_orders: iLimitOrder[];
  withdraws_from: iWithdrawsFrom[];
  more_data_available: iOptionalData;
}

export interface iAsset {
  id: string;
  symbol: string;
  /** Aka decimals; <= 12 */
  precision: number;
  issuer: string;
  options: {
    max_supply: string;
    market_fee_percent: number;
    max_market_fee: number;
    issuer_permissions: number;
    flags: number;
    core_exchange_rate: {
      base: {
        amount: number;
        asset_id: string;
      };
      quote: {
        amount: number;
        asset_id: string;
      };
    };
    description: string;
    extensions: {
      reward_percent: number;
    };
  };
  dynamic_asset_data_id: string;
  total_in_collateral: number;
}
type EventT = 'connected' | 'block' | 'account';
type SubT_A = (eventType: EventT, callbackFn: () => void) => void;
type SubT_B = (eventType: EventT, callbackFn: (x: object) => void) => void;
type SubT_C = (eventType: EventT, callbackFn: (x: any[]) => void) => void;

interface Ticker {
  time: string;
  base: string;
  quote: string;
  latest: string;
  lowest_ask: string;
  highest_bid: string;
  percent_change: string;
  base_volume: string;
  quote_volume: string;
}

interface LoginRetT {
  setFeeAsset: (...args: any[]) => any; // Generic Fn
  setMemoKey: (...args: any[]) => any; // Generic Fn
  broadcast: (...args: any[]) => any; // Generic Fn
  sendOperation: (...args: any[]) => any; // Generic Fn
  balances: (...args: any[]) => any; // Generic Fn
  buyOperation: (...args: any[]) => any; // Generic Fn
  buy: (...args: any[]) => any; // Generic Fn
  sellOperation: (...args: any[]) => any; // Generic Fn
  sell: (...args: any[]) => any; // Generic Fn
  orders: (...args: any[]) => any; // Generic Fn
  getOrder: (...args: any[]) => any; // Generic Fn
  cancelOrderOperation: (...args: any[]) => any; // Generic Fn
  cancelOrder: (...args: any[]) => any; // Generic Fn
  memo: (...args: any[]) => any; // Generic Fn
  memoDecode: (...args: any[]) => any; // Generic Fn
  transferOperation: (...args: any[]) => any; // Generic Fn
  transfer: (...args: any[]) => any; // Generic Fn
  assetIssueOperation: (...args: any[]) => any; // Generic Fn
  assetIssue: (...args: any[]) => any; // Generic Fn
  assetReserveOperation: (...args: any[]) => any; // Generic Fn
  assetReserve: (...args: any[]) => any; // Generic Fn
  activeKey: {
    d: {
      0: number;
      1: number;
      2: number;
      3: number;
      4: number;
      5: number;
      6: number;
      7: number;
      8: number;
      9: number;
      10: number;
      t: number;
      s: number;
    };
  };
  newTx: (...args: any[]) => any; // Generic Fn
  initPromise: {
    _U: number;
    _V: number;
    _W: undefined;
    _X: null;
  };
  memoKey: {
    d: {
      0: number;
      1: number;
      2: number;
      3: number;
      4: number;
      5: number;
      6: number;
      7: number;
      8: number;
      9: number;
      10: number;
      t: number;
      s: number;
    };
  };
  account: {
    id: string;
    membership_expiration_date: string;
    registrar: string;
    referrer: string;
    lifetime_referrer: string;
    network_fee_percentage: number;
    lifetime_referrer_fee_percentage: number;
    referrer_rewards_percentage: number;
    name: string;
    owner: {
      weight_threshold: number;
      key_auths: {
        0: any[]; // Nonuniformly typed array
      }[];
    };
    active: {
      weight_threshold: number;
      key_auths: {
        0: any[]; // Nonuniformly typed array
      }[];
    };
    options: {
      memo_key: string;
      voting_account: string;
      num_witness: number;
      num_committee: number;
    };
    statistics: string;
    owner_special_authority: any[]; // Nonuniformly typed array
    active_special_authority: any[]; // Nonuniformly typed array
    top_n_control_flags: number;
  };
  feeAsset: {
    id: string;
    symbol: string;
    precision: number;
    issuer: string;
    options: {
      max_supply: string;
      market_fee_percent: number;
      max_market_fee: string;
      issuer_permissions: number;
      flags: number;
      core_exchange_rate: {
        base: {
          amount: number;
          asset_id: string;
        };
        quote: {
          amount: number;
          asset_id: string;
        };
      };
      description: string;
      extensions: {};
    };
    dynamic_asset_data_id: string;
    total_in_collateral: number;
  };
}
interface iTradeHistorical {
  sequence: number;
  date: string;
  price: string;
  amount: string;
  value: string;
  side1_account_id: string;
  side2_account_id: string;
}
export interface Order {
  price: string;
  quote: string;
  base: string;
}
export interface OrderBook {
  base: string;
  quote: string;
  bids: Order[];
  asks: Order[];
}
export interface Meta1Module {
  connect: (connection?: string) => Promise<any>;
  disconnect: () => void;
  db: {
    get_objects: (ids: string[]) => Promise<any>;
    list_assets: (symbol: string, limit: number) => Promise<iAsset[]>;
    get_full_accounts: (names: string[], sub: boolean) => Promise<ArrayMap<string, fullAccount>>;
    get_ticker: (assetSymbolA: string, assetSymbolB: string) => Promise<Ticker>;
    /**
     * @param assetA asset symbol
     * @param assetB asset symbol
     * @param endTime the most recent entry timestamp, ISO format NOTE: Trim the timezone component of date string
     * @param startTime the oldest entry timestamp, ISO format NOTE: Trim the timezone component of date string
     * @param limit limit, capped at 100
     * @returs An array of {@link iTradeHistorical}
     */
    get_trade_history: (
      assetA: string,
      assetB: string,
      endTime: string,
      startTime: string,
      limit: number,
    ) => Promise<iTradeHistorical[]>;
    get_order_book: (assetA: string, assetB: string, limit: number) => Promise<OrderBook>;
  };
  subscribe: SubT_A | SubT_B | SubT_C;
  login: (accountName: string, password: string) => Promise<LoginRetT>;
}

const meta1dex = require('meta1dex');

export default meta1dex as Meta1Module;
