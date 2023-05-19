import { useEffect, useState } from 'react';
import { AssetBalanceT } from '../../services/meta1Api';
import calculateMarketLiquidity from '../../utils/marketOrder/calculateMarketLiquidity';
import calculateMarketPrice from '../../utils/marketOrder/calculateMarketPrice';
import meta1dex from '../../utils/meta1dexTypes';
import { createPair, theAsset, useAsset } from '../../utils/useAsset';

const useAssetPair = (
  defaultAssetA?: AssetBalanceT,
  defaultAssetB?: AssetBalanceT,
): null | { assets: { A: theAsset; B: theAsset }; backingAssetValue: number } => {
  const [backingAssetValue, setBackingAssetValue] = useState(0);
  const [A, B] = createPair(
    useAsset({ defaultValue: defaultAssetA, title: 'Trade' }),
    useAsset({ defaultValue: defaultAssetB, title: 'Trade' }),
  );

  const setAsyncMarketPrice = async (base: theAsset, quote: theAsset) => {
    const {
      marketPrice,
      baseAssetPrice,
      quoteAssetPrice,
      backingAssetValue: backingValue,
    } = await calculateMarketPrice(base, quote);
    base.setMarketPrice(marketPrice);
    quote.setMarketPrice(1 / marketPrice);
    setBackingAssetValue(backingValue);
    base.setBasePrice(baseAssetPrice);
    quote.setBasePrice(quoteAssetPrice);
  };

  const setAsyncMarketLiquidity = async (base: theAsset, quote: theAsset) => {
    const liquidity = await calculateMarketLiquidity(base, quote);
    base.setMarketLiquidity(liquidity * base.marketPrice);
    quote.setMarketLiquidity(liquidity);
  };

  useEffect(() => {
    console.log('One of Assets symbol Changed');
    if (!A || !B) {
      return;
    }
    A.setAmount('0.00');
    B.setAmount('0.00');
  }, [A?.asset.symbol, B?.asset.symbol]);

  useEffect(() => {
    if (A && B) {
      async function load() {
        if (!A || !B) {
          return;
        }
        console.log('Update ticker');
        const tickerA = await meta1dex.db
          .get_ticker(A.asset.symbol, B.asset.symbol)
          .catch(console.log);
        console.log({ tickerA });
        A.setTicker(tickerA || undefined);

        const tickerB = await meta1dex.db
          .get_ticker(B.asset.symbol, A.asset.symbol)
          .catch(console.log);
        console.log({ tickerB });
        B.setTicker(tickerB || undefined);
      }

      load();
      setAsyncMarketPrice(A, B);
      setAsyncMarketLiquidity(A, B);
    }
  }, [A?.asset.symbol, B?.asset.symbol, A?.amount, B?.amount]);

  if (!A || !B) {
    return null;
  }

  return {
    assets: { A, B },
    backingAssetValue,
  };
};

export default useAssetPair;
