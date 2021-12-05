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

export interface Ticker {
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

export interface LoginRetT {
  setFeeAsset: (...args: any[]) => any; // Generic Fn
  setMemoKey: (...args: any[]) => any; // Generic Fn
  broadcast: (...args: any[]) => any; // Generic Fn
  sendOperation: (...args: any[]) => any; // Generic Fn
  balances: (...args: any[]) => any; // Generic Fn
  buyOperation: (...args: any[]) => any; // Generic Fn
  buy: (
    buySymbol: string,
    baseSymbol: string,
    amount: number | string,
    price: number | string,
    fill_or_kill: boolean,
    expire: string | Date,
  ) => any; // Generic Fn
  sellOperation: (...args: any[]) => any; // Generic Fn
  sell: (
    sellSymbol: string,
    baseSymbol: string,
    amount: number | string,
    price: number | string,
    fill_or_kill: boolean,
    expire: string | Date,
  ) => any; // Generic Fn
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
export interface iTradeHistorical {
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

// From here https://doxygen.bitshares.org/operations_8hpp_source.html#l00055
export enum OP_TYPE {
  transfer_operation = 0,
  limit_order_create_operation,
  limit_order_cancel_operation,
  call_order_update_operation,
  fill_order_operation, // VIRTUAL
  account_create_operation,
  account_update_operation,
  account_whitelist_operation,
  account_upgrade_operation,
  account_transfer_operation,
  asset_create_operation,
  asset_update_operation,
  asset_update_bitasset_operation,
  asset_update_feed_producers_operation,
  asset_issue_operation,
  asset_reserve_operation,
  asset_fund_fee_pool_operation,
  asset_settle_operation,
  asset_global_settle_operation,
  asset_publish_feed_operation,
  witness_create_operation,
  witness_update_operation,
  proposal_create_operation,
  proposal_update_operation,
  proposal_delete_operation,
  withdraw_permission_create_operation,
  withdraw_permission_update_operation,
  withdraw_permission_claim_operation,
  withdraw_permission_delete_operation,
  committee_member_create_operation,
  committee_member_update_operation,
  committee_member_update_global_parameters_operation,
  vesting_balance_create_operation,
  vesting_balance_withdraw_operation,
  worker_create_operation,
  custom_operation,
  assert_operation,
  balance_claim_operation,
  override_transfer_operation,
  transfer_to_blind_operation,
  blind_transfer_operation,
  transfer_from_blind_operation,
  asset_settle_cancel_operation, // VIRTUAL
  asset_claim_fees_operation,
  fba_distribute_operation, // VIRTUAL
  bid_collateral_operation,
  execute_bid_operation, // VIRTUAL
  asset_claim_pool_operation,
  asset_update_issuer_operation,
  htlc_create_operation,
  htlc_redeem_operation,
  htlc_redeemed_operation, // VIRTUAL
  htlc_extend_operation,
  htlc_refund_operation, // VIRTUAL
  custom_authority_create_operation,
  custom_authority_update_operation,
  custom_authority_delete_operation,
  ticket_create_operation,
  ticket_update_operation,
  liquidity_pool_create_operation,
  liquidity_pool_delete_operation,
  liquidity_pool_deposit_operation,
  liquidity_pool_withdraw_operation,
  liquidity_pool_exchange_operation,
  samet_fund_create_operation,
  samet_fund_delete_operation,
  samet_fund_update_operation,
  samet_fund_borrow_operation,
  samet_fund_repay_operation,
  credit_offer_create_operation,
  credit_offer_delete_operation,
  credit_offer_update_operation,
  credit_offer_accept_operation,
  credit_deal_repay_operation,
  /* 74 */ credit_deal_expired_operation, // VIRTUAL
}

// From here https://doxygen.bitshares.org/base_8hpp_source.html#l00122
export enum RESULT_TYPE {
  void_result = 0,
  object_id_type,
  asset,
  generic_operation_result,
  generic_exchange_operation_result,
  extendable_operation_result /* 5 */,
}

export interface ITicker {
  id: string;
  key: {
    base: string;
    quote: string;
    seconds: number;
    open: string;
  };
  high_base: number;
  high_quote: number;
  low_base: number;
  low_quote: number;
  open_base: number;
  open_quote: number;
  close_base: number;
  close_quote: number;
  base_volume: number;
  quote_volume: number;
}

export type TypeIdPrefixed<T> = [number, ...T[]];
export type BucketSizeT = 60 | 300 | 900 | 1800 | 3600 | 14400 | 86400;
// prettier-ignore
export const ALL_BUCKETS: { [k: string] : BucketSizeT} = {
  '1M' : 60,
  '5M' : 300,
  '15M': 900,
  '30M': 1800,
  '1H' : 3600,
  '4H' : 14400,
  '1D' : 86400,
};

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
  history: {
    get_account_history: (account: string, bleh: string, limit: number, blah: string) => any;
    get_market_history_buckets: () => Promise<number[]>;
    get_market_history: (
      assetA: string,
      assetB: string,
      bucket_seconds: BucketSizeT,
      start: fcTime,
      end: fcTime,
    ) => Promise<ITicker[]>;
  };
  subscribe: SubT_A | SubT_B | SubT_C;
  login: (accountName: string, password: string) => Promise<LoginRetT>;
}

export class fcTime extends String {
  // This field is needed to disallow direct conversion between stiring and fcTime
  __pad: any;
  val: string;
  constructor(s?: string | number | Date) {
    let val;
    if (s) {
      //Append a to get the same value on output as in the input
      if (typeof s === 'string' && (s.length === 23 || s.length === 19)) {
        s += 'Z';
      }
      val = new Date(s).toISOString().slice(0, -1);
    } else {
      val = new Date().toISOString().slice(0, -1);
    }
    super(val);
    this.val = val;
    return;
  }
  static zero() {
    return new fcTime('2018-01-01T00:00:00');
  }

  public asDate() {
    return new Date(this.val + 'Z');
  }
}

const meta1dex = require('meta1dex');

export default meta1dex as Meta1Module;
