import { theAsset } from '../useAsset';
import Meta1 from '../../utils/meta1dexTypes';
import { ceilFloat, floorFloat } from './math';

const calculateBackingAssetValue = async (base: theAsset, quote: theAsset) => {
  const isQuoting = quote.asset.symbol === 'META1';

  const basePublishedPrice =
    base.asset.symbol !== 'META1'
      ? await Meta1.db.get_published_asset_price(base.asset.symbol)
      : null;
  const quotePublishedPrice =
    quote.asset.symbol !== 'META1'
      ? await Meta1.db.get_published_asset_price(quote.asset.symbol)
      : null;

  const assetLimitation = await Meta1.db.get_asset_limitation_value('META1');

  const meta1_usdt = ceilFloat(assetLimitation / 1000000000, 2);

  const baseAssetPrice = basePublishedPrice
    ? basePublishedPrice.numerator / basePublishedPrice.denominator
    : meta1_usdt;
  const quoteAssetPrice = quotePublishedPrice
    ? quotePublishedPrice.numerator / quotePublishedPrice.denominator
    : meta1_usdt;

  const asset_usdt = isQuoting ? baseAssetPrice : quoteAssetPrice;
  const ratio = isQuoting ? meta1_usdt / asset_usdt : asset_usdt / meta1_usdt;

  return isQuoting
    ? ceilFloat(ratio, quote.asset._asset.precision)
    : floorFloat(ratio, quote.asset._asset.precision);
};

export default calculateBackingAssetValue;
