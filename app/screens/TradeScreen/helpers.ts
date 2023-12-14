import throttle from 'lodash.throttle';
import { Alert } from 'react-native';
import { refreshAssets, swapWithPassword, useAssetsStore } from '../../services/meta1Api';
import { catchError, ensure, getPassword } from '../../utils';
import calculateMarketLiquidity from '../../utils/marketOrder/calculateMarketLiquidity';
import calculateMarketPrice from '../../utils/marketOrder/calculateMarketPrice';
import { getMaxOrderPrice } from '../../utils/marketOrder/getMaxOrderPrice';
import meta1dex from '../../utils/meta1dexTypes';
import { ScreenAssets, kindaStyle } from './types';
import Toast from 'react-native-toast-message';

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

export const validateNumber = (t: string) => /^(\d*([.,]\d*)?)$/m.test(t);

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
  // console.log('PerformSwap');
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

    const { marketPrice, highestPrice } = await calculateMarketPrice(assets.A, assets.B);

    console.log('Amount of Quote, marketPrice: ', +assets.A.amount / marketPrice, marketPrice);
    console.log('HighestPrice: ', highestPrice);

    const marketLiquidity = await calculateMarketLiquidity(assets.A, assets.B);
    assets.A.setMarketPrice(marketPrice);
    assets.B.setMarketLiquidity(marketLiquidity);

    if (
      +assets.A.amount > assets.A.asset.amount ||
      +assets.A.amount / marketPrice > marketLiquidity
    ) {
      throw new Error(
        `Marked order failed. Not enough liquidity of ${assets.B.asset._asset.symbol}`,
      );
    }

    const feeFactor = 0.935;
    const precisionFactor = 3 / Math.pow(10, assets.B.asset._asset.precision);
    const tradePrice = marketPrice + precisionFactor;

    try {
      console.log(
        'My TRY',
        assets.A.asset.symbol,
        assets.B.asset.symbol,
        Number((+assets.B.amount).toFixed(assets.B.asset._asset.precision)),
        assets.A,
        tradePrice,
      );
      await swapWithPassword(
        accountInfo,
        assets.A.asset.symbol,
        assets.B.asset.symbol,
        Number(assets.B.amount),
        0.014706, //tradePrice, //assets.A.toUsdt(assets.A.asset.amount), //marketPrice
        true,
      );
    } catch (error) {
      try {
        console.log('My CATCH', error, highestPrice + precisionFactor);
        await swapWithPassword(
          accountInfo,
          assets.A.asset.symbol,
          assets.B.asset.symbol,
          Number((+assets.B.amount).toFixed(2)),
          highestPrice + precisionFactor,
          false,
        );
      } catch (error2) {
        try {
          console.log('!!!!!!!!!!!!!!!!!!!!!!!!!! My CATCH 3');
          await swapWithPassword(
            accountInfo,
            assets.A.asset.symbol,
            assets.B.asset.symbol,
            Number(assets.B.amount),
            999999999999999, // dirty hack to place market price order
            false,
          );
        } catch (error3) {
          throw new Error("The order can't be filled immediately! Please try to change amounts.");
        }
      }
    }

    onAfterSwap();
  };

  return () =>
    catchError(fn, {
      anyway: () => setTimeout(() => update(accountName), 100),
      onErr: e => {
        onFail();
        if ((e as Error).message === 'Expected value, got null') {
          return true; // Swallow this exception
        } else {
          splitToastMessage('error', (e as Error).message);
          return false;
        }
      },
    });
};

export const splitToastMessage = (type: string, message: string) => {
  const messageParts: Array<string> = message.split(/[.!?]/).filter(Boolean);
  if (messageParts.length > 1) {
    Toast.show({
      type: type,
      text1: messageParts[0],
      position: 'top',
      visibilityTime: 2000,
      onHide: () => {
        Toast.show({
          type: 'error',
          visibilityTime: 2000,
          text1: messageParts[1],
        });
      },
    });
  } else {
    return Toast.show({ type: type, text1: messageParts[0] });
  }
};

export const makeMessage = (assets: ScreenAssets) =>
  `Successfully traded ${assets.A.amount} ${assets.A.asset.symbol}` +
  ' to ' +
  `${assets.B.amount} ${assets.B.asset.symbol}`;

export const refresh = throttle(() => {
  console.log('BEGIN Refresh');
  refreshAssets().then(() => console.log('END Refresh'));
}, 30000);
