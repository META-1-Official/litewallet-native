import { useEffect, useState } from 'react';
import { AssetBalanceT } from '../../services/meta1Api';
import calculateMarketLiquidity from '../../utils/marketOrder/calculateMarketLiquidity';
import calculateMarketPrice from '../../utils/marketOrder/calculateMarketPrice';
import meta1dex from '../../utils/meta1dexTypes';
import { createPair, theAsset, useAsset } from '../../utils/useAsset';

const useAssetPair = (
  defaultAssetA?: AssetBalanceT,
  defaultAssetB?: AssetBalanceT,
): null | {
  assets: { A: theAsset; B: theAsset };
  backingAssetValue: number;
  swapAssets?: () => void;
  isButtonDisabled: boolean;
  swapAssetFlag: boolean;
} => {
  const [swapAssetFlag, setSwapAssetFlag] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [backingAssetValue, setBackingAssetValue] = useState(0);
  const [A, B] = createPair(
    useAsset({ defaultValue: defaultAssetA, title: 'Trade' }),
    useAsset({ defaultValue: defaultAssetB, title: 'Trade' }),
  );

  const swapAssets = () => {
    console.log('clicked swap');
    // setSwapAssetFlag(true);
    setSwapAssetFlag(prevState => !prevState);
    setIsButtonDisabled(true);
  };

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
        setIsButtonDisabled(false);
      }

      load();

      if (!swapAssetFlag) {
        setAsyncMarketPrice(A, B);
        setAsyncMarketLiquidity(A, B);
        console.log(
          '! Asset swapAssetFlag false',
          A.asset.symbol,
          B.asset.symbol,
          A.marketPrice,
          B.marketPrice,
        );
      } else {
        setAsyncMarketPrice(B, A);
        setAsyncMarketLiquidity(B, A);
        console.log(
          '! Asset swapAssetFlag true',
          A.asset.symbol,
          B.asset.symbol,
          A.marketPrice,
          B.marketPrice,
        );
      }
    }
  }, [A?.asset.symbol, B?.asset.symbol, A?.amount, B?.amount, isButtonDisabled]);

  if (!A || !B) {
    return null;
  }

  return {
    assets: !swapAssetFlag ? { A, B } : { A: B, B: A },
    backingAssetValue: !swapAssetFlag ? 1 / backingAssetValue : backingAssetValue,
    swapAssets,
    isButtonDisabled,
    swapAssetFlag,
  };
};

export default useAssetPair;
