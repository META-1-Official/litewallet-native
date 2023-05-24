import Meta1, { iLimitOrder } from '../meta1dexTypes';
import { theAsset } from '../useAsset';
import calculateBackingAssetValue from './calculateBackingAssetValue';
import { calculateDivideBy, calculatePrice } from './math';

const calculateLiquidity = (
  limitOrder: iLimitOrder,
  quotePrecision: number,
  backingAssetValue: number,
  price: number,
  isQuoting: boolean,
) => {
  let liquidity = 0;

  if ((!isQuoting && +backingAssetValue > price) || (isQuoting && +backingAssetValue < price)) {
    liquidity += limitOrder.for_sale / Math.pow(10, quotePrecision);
  }

  return liquidity;
};

const calculateMarketLiquidity = async (base: theAsset, quote: theAsset) => {
  let liquidity = 0;
  const limitOrders = await Meta1.db.get_limit_orders(base.asset.symbol, quote.asset.symbol, 300);

  if (limitOrders && limitOrders.length > 0) {
    const { backingAssetValue } = await calculateBackingAssetValue(base, quote);

    for (let limitOrder of limitOrders) {
      if (limitOrder.sell_price.quote.asset_id === base.asset._asset.id) {
        const isQuoting = quote.asset.symbol === 'META1';
        const divideBy = calculateDivideBy(
          base.asset._asset.precision,
          quote.asset._asset.precision,
        );
        const price = calculatePrice(limitOrder, divideBy, isQuoting);

        liquidity += backingAssetValue
          ? calculateLiquidity(
              limitOrder,
              quote.asset._asset.precision,
              backingAssetValue,
              price,
              isQuoting,
            )
          : limitOrder.for_sale / Math.pow(10, quote.asset._asset.precision);
      }
    }
  }

  liquidity = parseFloat(liquidity.toFixed(6));
  console.log('Market Liquidity: ', liquidity);

  return liquidity;
};

export default calculateMarketLiquidity;
