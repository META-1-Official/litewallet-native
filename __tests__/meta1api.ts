import config from '../app/config';
import { useStore } from '../app/store';
import { fetchAccountBalances, fetchAllAssets, getHistoryForAsset } from '../app/utils/meta1Api';
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
    expect(assets!.toatalChnage).toEqual(expect.any(Number));
    expect(assets!.changePercent).toEqual(expect.any(Number));
  });
  it('Fetches historical data', async () => {
    const history = await getHistoryForAsset('ETH');
    expect(history).toBeTruthy();
    expect(history.length).toBeGreaterThan(0);

    console.log(history);
  });
});
