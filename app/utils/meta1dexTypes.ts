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
