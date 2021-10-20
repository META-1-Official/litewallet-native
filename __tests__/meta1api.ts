import config from '../app/config';
import { useStore } from '../app/store';
import { fetchAllAssets } from '../app/utils/meta1Api';
import meta1dex from '../app/utils/meta1dexTypes';

jest.mock('react-native-encrypted-storage');
//@ts-ignore
global.fetch = jest.fn(() =>
  Promise.resolve({
    status: 503,
  }),
);

describe('Meta1dex api tests', () => {
  beforeAll(async () => {
    await meta1dex.connect(config.META1_CONNECTION_URL);
    useStore.subscribe(
      loading => {
        expect(loading).toBeFalsy();
      },
      state => state.loading,
    );
  });

  afterAll(async () => {
    await meta1dex.disconnect();
  });

  it('Fetches all assets', async () => {
    const assets = await fetchAllAssets();
    assets.forEach(asset => expect(asset.id.startsWith('1.3')));
  });

  it('Fetches all assets and respective balances', async () => {
    const assets = await fetchAllAssets();
    assets.forEach(asset => expect(asset.id.startsWith('1.3')));
  });
});
