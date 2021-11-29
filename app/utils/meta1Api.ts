import assert from 'assert';
import { zipObject } from 'lodash';
import QRCode from 'qrcode';
import create from 'zustand';
import config from '../config';
import { useStore } from '../store';
import {
  default as Meta1,
  default as meta1dex,
  iAsset,
  iBalance,
  LenPrefixedArray,
} from './meta1dexTypes';

// Number of miliseconds in one year
const YY = 3.154e10;

const setLoading = useStore.getState().setLoading;
const logout = useStore.getState().logout;

export const Connect = () => Meta1.connect(config.META1_CONNECTION_URL);

Meta1.subscribe('connected', () => {
  setLoading(false);
});

export async function fetchAssetWithIcon(asset_name: string) {
  // Uising imgur as a fallback image host is sub optimal
  // Or maybe its ok https://webapps.stackexchange.com/a/75994
  const fallback = new Map(
    Object.entries({
      bnb: 'https://i.imgur.com/6qrOJVB.png',
      btc: 'https://i.imgur.com/ufHHYqn.png',
      eos: 'https://i.imgur.com/0icY7DW.png',
      eth: 'https://i.imgur.com/ycvEO0V.png',
      ltc: 'https://i.imgur.com/SWpmXNL.png',
      meta1: 'https://i.imgur.com/1Qliy5v.png',
      usdt: 'https://i.imgur.com/d1wY468.png',
      xlm: 'https://i.imgur.com/1ukgaqb.png',
    }),
  );

  const _ = await Meta1.db.list_assets(asset_name, 101);
  const icons = _.map(e => ({ uri: fallback.get(e.symbol.toLowerCase()) }));

  const assets = _.map((e, i) => ({ ...e, icon: icons[i] }));

  return assets;
}

export type AllAssetsT = (iAsset & { icon: any })[];

export const fetchAllAssets = () => fetchAssetWithIcon('');

export type AssetBalanceT = {
  symbol: string;
  amount: number;
  total_value: number;
  usdt_value: number;
  delta: number;
} & PartialAssetBalanceT;

export type PartialAssetBalanceT = {
  _balance: iBalance;
  _asset: AllAssetsT[0];
};

export const getReadableBalance = (awb: PartialAssetBalanceT) =>
  awb._balance.balance / 10 ** awb._asset.precision;

export const getAssetToUSDTTicket = (assetSymbol: string) =>
  assetSymbol === 'USDT'
    ? { latest: 1, percent_change: 0 } // USDT/USDT pair does not extists
    : Meta1.db.get_ticker('USDT', assetSymbol).then(e => ({
        latest: Number(e.latest),
        percent_change: Number(e.percent_change),
      }));

function* AssetBalanceGenerator(base: PartialAssetBalanceT[]) {
  for (const el of base) {
    yield (async () => {
      const symbol = el._asset.symbol;
      const ticker = await getAssetToUSDTTicket(symbol);
      const amount = getReadableBalance(el);
      const usdt_value = ticker.latest;
      const total_value = amount * usdt_value;
      const delta = ticker.percent_change;

      return { symbol, amount, usdt_value, total_value, delta, ...el } as AssetBalanceT;
    })();
  }
}

export type AccountBalanceT = {
  assetsWithBalance: AssetBalanceT[];
  accountTotal: number;
  toatalChnage: number;
  changePercent: number;
};

const emptyBalance = (assetId: string): iBalance => ({
  id: '0.0.0', // mock
  owner: '0.0.0.0', // mock
  asset_type: assetId,
  balance: 0,
  maintenance_flag: false, // whatever
});

export async function fetchAccountBalances(accountName: string) {
  const accounts = await Meta1.db
    .get_full_accounts([accountName], false)
    .then(res => new Map(res));
  const account = accounts.get(accountName);

  if (!account) {
    console.warn('Api did not return requestd account', accountName);
    return logout();
  }

  const assets = await fetchAllAssets();

  const assetsWithBalanceRaw: PartialAssetBalanceT[] = assets.map(asset => ({
    _asset: asset,
    _balance: account.balances.find(b => b.asset_type === asset.id) || emptyBalance(asset.id),
  }));

  const assetsWithBalance: AssetBalanceT[] = await Promise.all([
    ...AssetBalanceGenerator(assetsWithBalanceRaw),
  ]);

  const accountTotal = assetsWithBalance.reduce((acc, cv) => acc + cv.total_value, 0);
  const toatalChnage = assetsWithBalance
    .map(e => e.delta * e.total_value * 0.01)
    .reduce((acc, cv) => acc + cv, 0);
  const changePercent = toatalChnage / (accountTotal * 0.01);
  return { assetsWithBalance, changePercent, toatalChnage, accountTotal };
}

export interface AccountWithPassword {
  accountName: string;
  password: string;
}

type swapWPassSig = (
  accountInfo: AccountWithPassword,
  from: string,
  to: string,
  amount: number,
) => Promise<any>;

/**
 * Swaps assetA to specified amount of assetB
 * @param accountInfo Account name and password
 * @param from        Symbol for asset you want to get rid of
 * @param to          Symbol for asset you want to get in the end
 * @param amount      Amount of the  asset you want to get in the end
 * @returns Idk i think tx?
 */
export const swapWithPassword: swapWPassSig = async (accountInfo, from, to, amount) => {
  const pair = await Meta1.db.get_ticker(from, to);

  if (!pair) {
    throw new Error(`Pair ${from}:${to} dosen't exist`);
  }

  const account = await Meta1.login(accountInfo.accountName, accountInfo.password);
  console.log('Buy params');
  console.log({
    to,
    from,
    amount,
    loweset_ask: pair.lowest_ask,
  });

  const buyResult = await account.buy(
    to,
    from,
    amount,
    pair.lowest_ask,
    false, // whatever
    new Date(new Date().getTime() + YY), // idk
  );
  console.log(buyResult);
  return buyResult;
};

type sendWithPasswordSig = (
  accountInfo: AccountWithPassword,
  sendInfo: {
    toAccount: string;
    asset: string;
    message?: '';
    amount: number;
  },
) => Promise<any>;

export const sendWithPassword: sendWithPasswordSig = async (accountInfo, sendInfo) => {
  const account = await Meta1.login(accountInfo.accountName, accountInfo.password);

  const sendResult = await account.transfer(
    sendInfo.toAccount,
    sendInfo.asset,
    sendInfo.amount,
    '', //sendInfo.message
  );

  return sendResult;
};

type OrderInfoT = {
  toGive: string;
  toGet: string;
  amount: number;
  price: number;
};

export const placeLimitOrder = async (accountInfo: AccountWithPassword, orderInfo: OrderInfoT) => {
  const account = await Meta1.login(accountInfo.accountName, accountInfo.password);
  console.log('login', account);
  const sellResult = await account.sell(
    orderInfo.toGive,
    orderInfo.toGet,
    orderInfo.amount,
    orderInfo.price,
    false, // whatever
    new Date(new Date().getTime() + YY), // idk
  );
  return sellResult;
};

export const depositAddress = async (accountName: string, asset: string) => {
  const res = await fetch(`https://gateway.api.meta1.io/api/wallet/init/${asset}`, {
    credentials: 'omit',
    headers: {
      'User-Agent': 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:84.0) Gecko/20100101 Firefox/84.0',
      Accept: 'application/json, text/plain, */*',
      'Accept-Language': 'en-US,en;q=0.5',
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
    },
    body: JSON.stringify({ metaId: accountName }),
    method: 'POST',
    mode: 'cors',
  });

  try {
    const json: { address: string } = await res.json();
    return json.address;
  } catch (e) {
    return '';
  }
};

const saitizeISOString = (x: string) => x.slice(0, -1);

export async function getHistoryForAsset(assetA: string) {
  // USDT/USDT pair just dosent make any sense, returning two datapoints for a straight line
  if (assetA === 'USDT') {
    return [1, 1];
  }
  const history = await meta1dex.db.get_trade_history(
    'USDT',
    assetA,
    saitizeISOString(new Date().toISOString()),
    '2021-01-01T00:00:00.000',
    100,
  );
  // A hackish way to drop all the unnecasary floating point precision
  const prices = history.map(e => +Number(e.price).toFixed(2));
  return prices;
}

export async function getTradesForAssetPair(assetA: string, assetB: string) {
  const history = await meta1dex.db.get_trade_history(
    assetB,
    assetA,
    saitizeISOString(new Date().toISOString()),
    '2021-01-01T00:00:00.000',
    100,
  );
  return history
    .map(e => ({ ...e, date: new Date(e.date) }))
    .sort((a, b) => b.date.getTime() - a.date.getTime());
}

export interface AddrT {
  qr: string;
  addr: string;
}

export async function getAddressForAccountAsset(accountName: string, symbol: string) {
  const addr = await depositAddress(accountName, symbol);
  const qr = await QRCode.toString(addr);
  return { qr, addr };
}

export const useAssets = () => {
  const accountName = useStore(state => state.accountName);
  const userAssets = useAssetsStore(state => state.userAssets);
  const fetch = useAssetsStore(state => state.fetchUserAssets);
  if (userAssets === null) {
    fetch(accountName);
  }

  return userAssets;
};

export async function getOrderBook(assetA: string, assetB: string) {
  return await meta1dex.db.get_order_book(assetB, assetA, 50);
}

interface AssetsStore {
  userAssets: AccountBalanceT | null;
  fetchUserAssets: (accountName: string) => Promise<void>;
}

export const useAssetsStore = create<AssetsStore>(set => ({
  userAssets: null,
  fetchUserAssets: async (accountName: string) => {
    const res = await fetchAccountBalances(accountName);
    set({ userAssets: res! });
  },
}));

useStore.subscribe(
  () => {
    useAssetsStore.setState({ userAssets: null });
  },
  state => state.authorized,
);

const ObjectIDs = {
  account: '1.2.0',
  asset: '1.3.0',
  force_settlement: '1.4.0',
  committee_member: '1.5.0',
  witness: '1.6.0',
  limit_order: '1.7.0',
  call_order: '1.8.0',
  proposal: '1.10.0',
  operation_history: '1.11.0',
  withdraw_permission: '1.12.0',
  vesting_balance: '1.13.0',
  worker: '1.14.0',
  balance: '1.15.0',
  htlc: '1.16.0',
  ticket: '1.18.0',
  liquidity_pool: '1.19.0',
  global_property: '2.0.0',
  dynamic_global_property: '2.1.0',
  asset_dynamic_data: '2.3.0',
  asset_bitasset_data: '2.4.0',
  account_balance: '2.5.0',
  account_statistics: '2.6.0',
  transaction_history: '2.7.0',
  block_summary: '2.8.0',
  account_transaction_history: '2.9.0',
  blinded_balance: '2.10.0',
  chain_property: '2.11.0',
  witness_schedule: '2.12.0',
  budget_record: '2.13.0',
  special_authority: '2.14.0',
  buyback: '2.15.0',
  fba_accumulator: '2.16.0',
  collateral_bid: '2.17.0',
};

const insideOut = zipObject(Object.values(ObjectIDs), Object.keys(ObjectIDs));

export function resolveObjectId(id: string) {
  const tmp = id.match(/\d\.\d{1,2}\./);

  if (!tmp) {
    return;
  }

  const [slice] = tmp;
  const search = slice + '0';

  return insideOut[search];
}

export const parseHistoryEntry = (
  op: LenPrefixedArray<any>,
  resultArr: LenPrefixedArray<string>,
) => {
  const [opLen, ...restOp] = op;
  const [resultsLen, ...restResults] = resultArr;

  assert(opLen === resultsLen, 'Results type length does not mathch ops length');

  return zipObject(
    restResults.map(e => resolveObjectId(e)!),
    restOp,
  );
};
