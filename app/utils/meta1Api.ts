import { ensure } from '.';
import config from '../config';
import { useStore } from '../store';
import Meta1, { iAsset, iBalance } from './meta1dexTypes';

const setLoading = useStore.getState().setLoading;
const logout = useStore.getState().logout;

export const Connect = () => Meta1.connect(config.META1_CONNECTION_URL);

Meta1.subscribe('connected', () => {
  console.log('Connected!');
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
  amoutnt: number;
  price: number;
  usdt_value: number;
} & PartialAssetBalanceT;

export type PartialAssetBalanceT = {
  _balance: iBalance;
  _asset: iAsset;
};

export const getReadableBalance = (awb: PartialAssetBalanceT) =>
  awb._balance.balance / 10 ** awb._asset.precision;

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

  const assetsWithBalance: AssetBalanceT[] = assetsWithBalanceRaw.map(e => ({
    symbol: e._asset.symbol,
    amoutnt: getReadableBalance(e),
    // TODO: Get price and calculate usdt value based on it
    price: -1,
    usdt_value: -1,
    ...e,
  }));

  return assetsWithBalance;
}
