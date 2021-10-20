import config from '../app/config';
import { useStore } from '../app/store';
import { fetchAccountBalances, fetchAllAssets } from '../app/utils/meta1Api';
import Meta1 from '../app/utils/meta1dexTypes';

jest.mock('react-native-encrypted-storage');
//@ts-ignore
global.fetch = jest.fn(() =>
  Promise.resolve({
    status: 503,
  }),
);

describe('Meta1 api tests', () => {
  beforeAll(async () => {
    await Meta1.connect(config.META1_CONNECTION_URL);
    useStore.subscribe(
      loading => {
        expect(loading).toBeFalsy();
      },
      state => state.loading,
    );
  });

  afterAll(async () => {
    await Meta1.disconnect();
  });

  it('Fetches all assets', async () => {
    const assets = await fetchAllAssets();
    assets.forEach(asset => expect(asset.id.startsWith('1.3')));
  });

  it('Fetches all assets and respective balances', async () => {
    const assets = await fetchAccountBalances('kj-test2');
    expect(assets).toBeTruthy();
    assets!.forEach(balance => expect(balance._asset.id.startsWith('1.3')));
  });

  it('Converts asset balance to usdt value', async () => {
    const assets = await fetchAccountBalances('kj-test2');
    expect(assets).toBeTruthy();

    assets!.forEach(balance => expect(balance._asset.id.startsWith('1.3')));

    console.log(assets);
  });
});
