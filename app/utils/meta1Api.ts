import { ensure } from '.';
import config from '../config';
import { useStore } from '../store';
import Meta1, { iAsset, iBalance } from './meta1dexTypes';
import create from 'zustand';

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

  const icon = (symbol: string) => `https://cryptoicons.org/api/icon/${symbol.toLowerCase()}/128`;

  const _ = await Meta1.db.list_assets(asset_name, 101);
  const icons = await Promise.all(
    _.map(e =>
      // Try to get the icon form cryptoicons api
      fetch(icon(e.symbol), { method: 'HEAD' }).then(res =>
        res.status === 200
          ? { uri: icon(e.symbol) }
          : { uri: fallback.get(e.symbol.toLowerCase()) },
      ),
    ),
  );
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

  const assetsWithBalanceRaw: PartialAssetBalanceT[] = account.balances.map(bal => ({
    _balance: bal,
    _asset: ensure(assets.find(e => e.id === bal.asset_type)),
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

export const swapWithPassword = async (
  accountInfo: AccountWithPassword,
  from: string,
  to: string,
  amount: number,
) => {
  const pair = await Meta1.db.get_ticker(from, to);

  if (!pair) {
    throw new Error(`Pair ${from}:${to} dosen't exist`);
  }

  const account = await Meta1.login(accountInfo.accountName, accountInfo.password);

  const buyResult = await account.buy(
    to,
    from,
    amount,
    pair.lowest_ask,
    false, // whatever
    new Date('12/12/2021'), // idk
  );
  console.log(buyResult);
  return buyResult;
};

export const useAssets = () => {
  const accountName = useStore(state => state.accountName);
  const userAssets = useAssetsStore(state => state.userAssets);
  const fetch = useAssetsStore(state => state.fetchUserAssets);
  if (userAssets === null) {
    fetch(accountName);
  }

  return userAssets;
};

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
