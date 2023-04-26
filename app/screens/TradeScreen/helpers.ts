import throttle from 'lodash.throttle';
import { Alert } from 'react-native';
import { refreshAssets, swapWithPassword, useAssetsStore } from '../../services/meta1Api';
import { catchError, ensure, getPassword } from '../../utils';
import meta1dex from '../../utils/meta1dexTypes';
import { ScreenAssets, kindaStyle } from './types';

export function setMaxAmount(assets: ScreenAssets) {
  const { A, B } = assets;
  if (A.ticker && A.ticker.lowest_ask !== '0') {
    const aMax = A.getMax();
    const pow = 10 ** B.asset._asset.precision;
    const x = (aMax / Number(A.ticker.lowest_ask)) * pow;
    const bMax = Math.floor(x) / pow;
    A.setAmount(aMax.toFixed(A.asset._asset.precision));
    B.setAmount(bMax.toFixed(B.asset._asset.precision));
  } else {
    Alert.alert('Failed to get exchange rate', 'No open orders found');
  }
}

export const editing: any = { current: null };

export const optStyleFactory =
  (darkMode?: boolean) =>
  (x: kindaStyle, defaults?: kindaStyle): any => {
    if (darkMode) {
      return [defaults, x];
    }
    return [defaults];
  };

export const validateNumber = (t: string) => /^(\d+([.,]\d+)?)$/m.test(t);

export const crossCheckPrice = async ({ A, B }: ScreenAssets) => {
  try {
    const ticker = await meta1dex.db.get_ticker(A.asset.symbol, B.asset.symbol);
    if (!ticker || !ticker.lowest_ask || ticker.lowest_ask === '0') {
      return;
    }
    const price = Number(A.amount) / Number(B.amount);
    const tickerPrice = Number(ticker.lowest_ask);
    const mesq = (1 / 2) * (price - tickerPrice) ** 2;
    console.log('mesq', mesq);
    return mesq < 1e-10;
  } catch (e: any) {
    console.warn(e);
  }
};

export const mkPerformSwap = (
  assets: ScreenAssets,
  onBeforeSwap: () => void,
  onAfterSwap: () => void,
  onFail: () => void,
  accountName: string,
) => {
  const update = useAssetsStore.getState().fetchUserAssets;

  const getAccountInfo = async () => ({
    accountName,
    password: ensure(await getPassword()),
  });

  const fn = async () => {
    console.log(assets.B.amount);
    const accountInfo = await getAccountInfo();

    onBeforeSwap();
    assets.A.isAffordableForSwap();
    if (assets.A.asset.symbol === assets.B.asset.symbol) {
      throw new Error("Can't swap the same assets");
    }

    if (!(await crossCheckPrice(assets))) {
      // Noop
    }

    await swapWithPassword(
      accountInfo,
      assets.A.asset.symbol,
      assets.B.asset.symbol,
      Number(assets.B.amount),
      0.002919, //assets.A.toUsdt(assets.A.asset.amount), //tradePrice
    );

    onAfterSwap();
  };

  return () =>
    catchError(fn, {
      anyway: () => setTimeout(() => update(accountName), 100),
      onErr: e => {
        onFail();
        if ((e as Error).message === 'Expected value, got null') {
          return true; // Swallow this exception
        }
      },
    });
};

export const makeMessage = (assets: ScreenAssets) =>
  `Successfully traded ${assets.A.amount} ${assets.A.asset.symbol}` +
  ' to ' +
  `${assets.B.amount} ${assets.B.asset.symbol}`;

export const refresh = throttle(() => {
  console.log('BEGIN Refresh');
  refreshAssets().then(() => console.log('END Refresh'));
}, 30000);
