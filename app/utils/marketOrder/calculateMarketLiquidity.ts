import Meta1 from '../meta1dexTypes';
import { theAsset } from '../useAsset';
import calculateBackingAssetValue from './calculateBackingAssetValue';

const calculateMarketLiquidity = async (base: theAsset, quote: theAsset) => {
  let _liquidity = 0;

  const _limitOrders = await Meta1.db.get_limit_orders(base.asset.symbol, quote.asset.symbol, 300);

  if (_limitOrders && _limitOrders.length > 0) {
    const { backingAssetValue } = await calculateBackingAssetValue(base, quote);

    for (let limitOrder of _limitOrders) {
      if (limitOrder.sell_price.quote.asset_id === base.asset._asset.id) {
        let divideby;
        let price;

        if (backingAssetValue) {
          const isQuoting = quote.asset.symbol === 'META1';

          if (!isQuoting) {
            divideby = Math.pow(10, base.asset._asset.precision - quote.asset._asset.precision);
            price = Number(
              limitOrder.sell_price.quote.amount / limitOrder.sell_price.base.amount / divideby,
            );
          } else {
            divideby = Math.pow(10, quote.asset._asset.precision - base.asset._asset.precision);
            price = Number(
              limitOrder.sell_price.base.amount / limitOrder.sell_price.quote.amount / divideby,
            );
            price = 1 / price;
          }

          // Consider backing asset level
          if (!isQuoting && +backingAssetValue > price) {
            _liquidity += Number(limitOrder.for_sale) / Math.pow(10, quote.asset._asset.precision);
          } else if (isQuoting && +backingAssetValue < price) {
            _liquidity += Number(limitOrder.for_sale) / Math.pow(10, quote.asset._asset.precision);
          }
        } else {
          _liquidity += Number(limitOrder.for_sale) / Math.pow(10, quote.asset._asset.precision);
        }
      }
    }
  }
  console.log('Market Liquidity : ', parseFloat(_liquidity.toFixed(6)));
  return parseFloat(_liquidity.toFixed(6));
};

export default calculateMarketLiquidity;
