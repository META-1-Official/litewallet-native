import { useEffect } from 'react';
import { AssetBalanceT } from '../../../services/meta1Api';
import meta1dex from '../../../utils/meta1dexTypes';
import { createPair, useAsset } from '../../../utils/useAsset';

const useAssetPair = (defaultAssetA?: AssetBalanceT, defaultAssetB?: AssetBalanceT) => {
  const [A, B] = createPair(
    useAsset({ defaultValue: defaultAssetA, title: 'Trade' }),
    useAsset({ defaultValue: defaultAssetB, title: 'Trade' }),
  );

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
  }, [A?.asset.symbol, B?.asset.symbol]);

  if (!A || !B) {
    return null;
  }

  return {
    assets: { A, B },
  };
};

export default useAssetPair;
