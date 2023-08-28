import useAppSelector from '../../hooks/useAppSelector';
import { OrderType } from './types';

const usePair = (type: OrderType) => {
  const { assetA, assetB } = useAppSelector(state => state.dex.tradingPair);
  const pair = [assetA, assetB];
  switch (type) {
    case OrderType.Buy:
      return pair;
    case OrderType.Sell:
      return pair.reverse();
  }
};

export default usePair;
