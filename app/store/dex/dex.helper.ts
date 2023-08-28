import { Statuses } from '../../services/meta1Api';
import { DexState } from './dex.reducer';

export const filterOrdersByAssets = (orders: any[], assetA?: string, assetB?: string) => {
  return orders.filter(order =>
    [assetA, assetB].every(item =>
      [
        order.order.limit_order_create_operation.min_to_receive.asset.symbol,
        order.order.limit_order_create_operation.amount_to_sell.asset.symbol,
      ].includes(item),
    ),
  );
};

export const openedOrdersSelector = (state: DexState) => {
  return state.orders.filter(order => order.status === Statuses.open);
};

export const historicalOrdersSelector = (state: DexState) => {
  return state.orders.filter(order => order.status !== Statuses.open);
};
