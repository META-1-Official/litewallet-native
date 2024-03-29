import config from '../app/config';
import { useStore } from '../app/store';
import {
  fetchAccountBalances,
  fetchAllAssets,
  // getAccountHistory,
  getHistoricalOrders,
  getHistoryForAsset,
  getOrderBook,
  getTradesForAssetPair,
  HistoryRetT,
  useAssetsStore,
} from '../app/services/meta1Api';
import meta1dex, { fcTime } from '../app/utils/meta1dexTypes';
import Meta1 from '../app/utils/meta1dexTypes';

jest.mock('react-native-encrypted-storage');
//@ts-ignore
global.fetch = jest.fn(() =>
  Promise.resolve({
    status: 503,
  }),
);

// Temporarely override console.log
const consoleLogHook = async (fn: () => any) => {
  const oConsoleLog = console.log;
  console.log = () => {};
  await fn();
  console.log = oConsoleLog;
};

describe('Meta1 api tests', () => {
  beforeAll(async () => {
    await consoleLogHook(async () => await Meta1.connect(config.META1_CONNECTION_URL));
    useStore.subscribe(
      loading => {
        expect(loading).toBeFalsy();
      },
      state => state.loading,
    );
  });

  afterAll(async () => {
    await consoleLogHook(async () => await Meta1.disconnect());
  });

  it('Fetches all assets, and assets are valid', async () => {
    const assets = await fetchAllAssets();
    assets.forEach(asset => expect(asset.id.startsWith('1.3')));
  });

  it('Fetches all assets and respective balances, and assets are valid', async () => {
    const assets = await fetchAccountBalances('kj-test2');
    expect(assets).toBeTruthy();
    assets!.assetsWithBalance.forEach(balance => expect(balance._asset.id.startsWith('1.3')));
  });

  it('Account total, Toatal chnage and Change percent are valid', async () => {
    const assets = await fetchAccountBalances('kj-test2');
    expect(assets).toBeTruthy();
    expect(assets!.accountTotal).toEqual(expect.any(Number));
    expect(assets!.totalChange).toEqual(expect.any(Number));
    expect(assets!.changePercent).toEqual(expect.any(Number));
  });
  it('Fetches historical data', async () => {
    const history = await getHistoryForAsset('ETH');
    expect(history).toBeTruthy();
    expect(history.length).toBeGreaterThan(0);
  });

  it('Fetches trades history', async () => {
    const history = await getTradesForAssetPair('ETH', 'USDT');
    expect(history).toBeTruthy();
    expect(history.length).toBeLessThanOrEqual(100);
  });

  it('Fetches orders', async () => {
    const asdf = await getOrderBook('ETH', 'USDT');
    expect(asdf).toBeTruthy();
  });

  // Comented out cause too slow and produces sideeffects on production
  // ---------

  /*
  it('Places sell order, real slow', async () => {
    const accountInfo = {
      accountName: 'kj-test2',
      password: 'P5KFSVTSJDmjPFWy51gfpskdxUJfUVXtVVAhz1q7TBqW2imhH4C1',
    };

    const account = await Meta1.login(accountInfo.accountName, accountInfo.password);
    const assets = await fetchAllAssets();

    const orders = await account.orders();
    for (const order of orders) {
      console.log(order.id);
      console.log(order.sell_price);
      const base = assets.find(e => e.id === order.sell_price.base.asset_id)?.symbol;
      const quote = assets.find(e => e.id === order.sell_price.quote.asset_id)?.symbol;
      console.log({ base, quote });
    }

    const res = await placeLimitOrder(accountInfo, {
      toGet: 'USDT',
      toGive: 'META1',
      amount: 0.01,
      price: 1337,
    });

    console.log(res);
  }, 30000);
  */

  // it('Fetch account histroy', async () => {
  //   await useAssetsStore.getState().fetchUserAssets('kj-test2');
  //   console.log(await getAccountHistory('kj-test2'));
  // });

  it('Cool order History', async () => {
    await useAssetsStore.getState().fetchUserAssets('kj-test2');
    const res = await getHistoricalOrders('kj-test2');
    const first: {
      order: HistoryRetT;
      canceled: any;
      filled: any[];
    } = res.values().next().value;
    const acc = await meta1dex.login(
      'kj-test2',
      'P5KFSVTSJDmjPFWy51gfpskdxUJfUVXtVVAhz1q7TBqW2imhH4C1',
    );

    const order = await acc.getOrder(
      first.order.limit_order_create_operation.result.object_id_type,
    );
    order;

    // console.log('res', res);
  });

  it('Fc time is correct', () => {
    const inp = '2018-01-01T00:00:00';
    const out = new fcTime(inp);
    expect(out.slice(0, -4)).toEqual(inp);
  });

  it('Gets OCHL data', async () => {
    const _ticks = await meta1dex.history.get_market_history(
      'META1',
      'USDT',
      60,
      new fcTime('2018-01-01T00:00:00'),
      new fcTime(),
    );
  });
});
