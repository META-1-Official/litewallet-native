import { useAVStore } from '../../screens/dex/AssetView/AssetViewStore';
import { OrderType } from './types';

const usePair = (type: OrderType) => {
  const { assetA, assetB } = useAVStore();
  const pair = [assetA, assetB];
  switch (type) {
    case OrderType.Buy:
      return pair;
    case OrderType.Sell:
      return pair.reverse();
  }
};

export default usePair;
