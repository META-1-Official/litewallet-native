import Meta1 from '../../utils/meta1dexTypes';
import { theAsset } from '../useAsset';
import calculateBackingAssetValue from './calculateBackingAssetValue';

const calculateMarketPrice = async (
  base: theAsset,
  quote: theAsset,
  selectedFromBalance = +quote.amount, // Calculate price based on quote
): Promise<{
  marketPrice: number;
  baseAssetPrice: number;
  quoteAssetPrice: number;
  backingAssetValue: number;
  highestPrice: number;
  orderPrice?: number;
}> => {
  console.log('!!!!!!!!Start calculate price: ', base, quote, selectedFromBalance);

  const orderBook = await Meta1.db.get_order_book(base.asset.symbol, quote.asset.symbol, 50);

  const { baseAssetPrice, quoteAssetPrice, backingAssetValue } = await calculateBackingAssetValue(
    base,
    quote,
  );

  let highestPrice = 0;
  let partialAmount = 0;
  let fullOrderPrice = 0;
  let averageMarketPrice = 0;

  for (let limitOrder of orderBook.asks) {
    if (partialAmount < +base.amount) {
      partialAmount = partialAmount + +limitOrder.base;
      if (partialAmount < +base.amount) {
        fullOrderPrice = fullOrderPrice + +limitOrder.base * +limitOrder.price;
      } else {
        fullOrderPrice =
          fullOrderPrice +
          (+limitOrder.base - (+partialAmount - +base.amount)) * +limitOrder.price;
      }
    } else {
      averageMarketPrice = fullOrderPrice / +base.amount;
    }
    highestPrice = Math.max(highestPrice, +limitOrder.price);
  }

  //todo: implement bigNumbers here https://github.com/MikeMcl/bignumber.js
  return {
    marketPrice: averageMarketPrice
      ? averageMarketPrice
      : highestPrice
      ? highestPrice
      : backingAssetValue,
    baseAssetPrice,
    quoteAssetPrice,
    backingAssetValue,
    highestPrice,
  };
};

export default calculateMarketPrice;
