import Meta1 from '../../utils/meta1dexTypes';
import { theAsset } from '../useAsset';
import calculateBackingAssetValue from './calculateBackingAssetValue';
import { calculateAmount, calculateDivideBy, calculatePrice } from './math';

const calculateMarketPrice = async (
  base: theAsset,
  quote: theAsset,
  selectedFromBalance = 0,
): Promise<{
  marketPrice: number;
  baseAssetPrice: number;
  quoteAssetPrice: number;
  backingAssetValue: number;
}> => {
  let marketPrice = 0;
  let estSellAmount = 0;
  const isQuoting = quote.asset.symbol === 'META1';
  const isTradingMETA1 = base.asset.symbol === 'META1' || isQuoting;

  const limitOrders = await Meta1.db.get_limit_orders(base.asset.symbol, quote.asset.symbol, 300);

  const divideBy = calculateDivideBy(base.asset._asset.precision, quote.asset._asset.precision);
  const { baseAssetPrice, quoteAssetPrice, backingAssetValue } = await calculateBackingAssetValue(
    base,
    quote,
  );

  for (let limitOrder of limitOrders) {
    if (limitOrder.sell_price.quote.asset_id === base.asset._asset.id) {
      let price = calculatePrice(limitOrder, divideBy);

      if (isTradingMETA1 && backingAssetValue) {
        if (
          (!isQuoting && backingAssetValue > price) ||
          (isQuoting && backingAssetValue < price)
        ) {
          marketPrice = marketPrice
            ? isQuoting
              ? Math.min(marketPrice, price)
              : Math.max(marketPrice, price)
            : price;
        }
      } else {
        marketPrice = Math.max(marketPrice, price);
      }

      if (selectedFromBalance) {
        const amount = calculateAmount(limitOrder.for_sale, quote.asset._asset.precision);
        estSellAmount += marketPrice * amount;
        if (estSellAmount > selectedFromBalance) {
          break;
        }
      }
    }
  }

  if (marketPrice > 0) {
    const percentDiff = marketPrice + marketPrice / Math.pow(10, 3);
    const diff = Math.abs(marketPrice - backingAssetValue) / 2;

    if (isTradingMETA1 && backingAssetValue) {
      marketPrice =
        !isQuoting && percentDiff >= backingAssetValue ? marketPrice + diff : percentDiff;
    } else {
      marketPrice = percentDiff;
    }
  }

  console.log('MarketPrice:', base.asset._asset.symbol, quote.asset._asset.symbol, marketPrice);

  return {
    marketPrice: marketPrice !== 0 ? marketPrice : backingAssetValue,
    baseAssetPrice,
    quoteAssetPrice,
    backingAssetValue,
  };
};

export default calculateMarketPrice;
