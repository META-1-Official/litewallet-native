import { useEffect, useState } from 'react';
import { AssetBalanceT } from '../../services/meta1Api';
import calculateMarketPrice from '../../utils/marketOrder/calculateMarketPrice';
import meta1dex from '../../utils/meta1dexTypes';
import { createPair, useAsset } from '../../utils/useAsset';

const useAssetPair = (defaultAssetA?: AssetBalanceT, defaultAssetB?: AssetBalanceT) => {
  const [marketPrice, setMarketPrice] = useState(0);
  const [A, B] = createPair(
    useAsset({ defaultValue: defaultAssetA, title: 'Trade' }),
    useAsset({ defaultValue: defaultAssetB, title: 'Trade' }),
  );

  const setAsyncMarketPrice = async (A, B) => {
    const price = await calculateMarketPrice(A, B);
    setMarketPrice(price);
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
  }, [A?.asset.symbol, B?.asset.symbol]);

  if (!A || !B) {
    return null;
  }

  return {
    assets: { A, B },
    marketPrice: marketPrice,
  };
};

export default useAssetPair;
