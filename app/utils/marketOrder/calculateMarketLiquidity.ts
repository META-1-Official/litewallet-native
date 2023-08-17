import Meta1 from '../meta1dexTypes';
import { theAsset } from '../useAsset';

const calculateMarketLiquidity = async (base: theAsset, quote: theAsset) => {
  let liquidity = 0;
  const limitOrders = await Meta1.db.get_limit_orders(base.asset.symbol, quote.asset.symbol, 300);

  if (limitOrders && limitOrders.length > 0) {
    for (let limitOrder of limitOrders) {
      if (limitOrder.sell_price.quote.asset_id === base.asset._asset.id) {
        liquidity += limitOrder.for_sale;
      }
    }
  }

  liquidity = liquidity / Math.pow(10, quote.asset._asset.precision);
  console.log('Market Liquidity: ', liquidity);

  return liquidity;
};

export default calculateMarketLiquidity;
