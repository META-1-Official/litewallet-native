import { theAsset } from '../useAsset';
import calculateBackingAssetValue from './calculateBackingAssetValue';

const calculateBlockPrice = async (base: theAsset, quote: theAsset, amount: number) => {
  const { quoteAssetPrice } = await calculateBackingAssetValue(base, quote);
  console.log('Block price: ', Number(amount) * quoteAssetPrice);
  return Number(amount) * quoteAssetPrice;
};

export default calculateBlockPrice;
