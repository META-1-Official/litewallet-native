import Meta1 from '../meta1dexTypes';
import { theAsset } from '../useAsset';
import { calculateAmount, calculateDivideBy } from './math';

export const getMaxOrderPrice = async (base: theAsset, quote: theAsset, amount: number) => {
  amount = calculateAmount(amount, quote.asset._asset.precision);
  const limitOrders = await Meta1.db.get_limit_orders(base.asset.symbol, quote.asset.symbol, 300);

  // Filter the orders for the specified base and quote
  let orders = limitOrders.filter(order => order.sell_price.quote.asset_id !== base.asset.symbol);
  const divideBy = calculateDivideBy(base.asset._asset.precision, quote.asset._asset.precision);

  console.log(divideBy);

  // Sort the orders by price from low to high
  orders.sort(
    (a, b) =>
      a.sell_price.quote.amount / a.sell_price.base.amount -
      b.sell_price.quote.amount / b.sell_price.base.amount,
  );

  let accumulatedAmount = 0;
  let maxOrderPrice = 0;

  for (let i = 0; i < orders.length; i++) {
    let order = orders[i];
    let orderAmount = order.for_sale;

    accumulatedAmount += orderAmount;

    if (accumulatedAmount >= amount) {
      // When we reach or surpass the desired amount,
      // we return the price of the current order and stop
      maxOrderPrice = order.sell_price.quote.amount / order.sell_price.base.amount / divideBy;
      break;
    }
  }

  return maxOrderPrice;
};
