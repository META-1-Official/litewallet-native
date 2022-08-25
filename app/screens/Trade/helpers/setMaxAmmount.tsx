import { Alert } from 'react-native';
import { theAsset } from '../../../hooks/useAsset';

type ScreenAssets = {
  A: theAsset;
  B: theAsset;
};

const setMaxAmount = (assets: ScreenAssets) => {
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
};

export default setMaxAmount;
