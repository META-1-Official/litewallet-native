import { useEffect, useState } from 'react';
import { AssetBalanceT } from '../../services/meta1Api';
import calculateMarketLiquidity from '../../utils/marketOrder/calculateMarketLiquidity';
import calculateMarketPrice from '../../utils/marketOrder/calculateMarketPrice';
import meta1dex from '../../utils/meta1dexTypes';
import { createPair, theAsset, useAsset } from '../../utils/useAsset';

const useAssetPair = (defaultAssetA?: AssetBalanceT, defaultAssetB?: AssetBalanceT) => {
  const [marketPrice, setMarketPrice] = useState(0);
  const [marketLiquidity, setMarketLiquidity] = useState(0);
  const [backingAssetValue, setBackingAssetValue] = useState(0);
  const [A, B] = createPair(
    useAsset({ defaultValue: defaultAssetA, title: 'Trade' }),
    useAsset({ defaultValue: defaultAssetB, title: 'Trade' }),
  );

  const setAsyncMarketPrice = async (A: theAsset, B: theAsset) => {
    const {
      marketPrice: price,
      baseAssetPrice,
      quoteAssetPrice,
      backingAssetValue: backingValue,
    } = await calculateMarketPrice(A, B);
    setMarketPrice(price);
    setBackingAssetValue(backingValue);
    A.setBasePrice(baseAssetPrice);
    B.setBasePrice(quoteAssetPrice);
  };

  const setAsyncMarketLiquidity = async (A: theAsset, B: theAsset) => {
    const liquidity = await calculateMarketLiquidity(A, B);
    setMarketLiquidity(liquidity);
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
  }, [A?.asset.symbol, B?.asset.symbol]);

  if (!A || !B) {
    return null;
  }

  return {
    assets: { A, B },
    marketPrice,
    marketLiquidity,
    backingAssetValue,
  };
};

export default useAssetPair;
