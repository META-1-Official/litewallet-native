import { inFuture } from '.';
import { AccountBalanceT, FilledRetT, HistoryRetT, limitOrderObjExt } from './meta1Api';

export const preprocessOrder = (order: any, userAssets: AccountBalanceT | null): HistoryRetT => {
  return {
    raw: order,
    limit_order_create_operation: {
      fee: order.deferred_paid_fee,
      seller: order.seller,
      expiration: order.expiration,
      fill_or_kill: false,
      result: { void_result: {} } as any,
      extensions: [],
      amount_to_sell: {
        ...order.sell_price.base,
        asset: userAssets!.assetsWithBalance.find(
          e => e._asset.id === order.sell_price.base.asset_id,
        )!,
      },
      min_to_receive: {
        ...order.sell_price.quote,
        asset: userAssets!.assetsWithBalance.find(
          e => e._asset.id === order.sell_price.quote.asset_id,
        )!,
      },
    },
  } as HistoryRetT;
};

export type RejectFn = (canceled: any, filled: FilledRetT[], order: limitOrderObjExt) => boolean;
export const isOpen: RejectFn = (canceled, filled, order) => {
  return !(!canceled && !filled.length && inFuture(order.expiration));
};
export const isResolved: RejectFn = (canceled, filled, order) => {
  return !(canceled || filled.length || !inFuture(order.expiration));
};
