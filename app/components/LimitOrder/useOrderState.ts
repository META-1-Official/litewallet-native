import { useReducer } from 'react';
import { decrementFloatNumber, incrementFloatNumber } from './helpers';
import { OrderType, Update, State, Action } from './types';
import asAsset from './asAsset';

const useOrderState = (assetA: string, assetB: string, oType: OrderType) => {
  const Num = (s: string) => {
    const n = Number(s);
    if (isNaN(n)) {
      throw new Error('Bad number');
    }
    return n;
  };
  const Str = (asset: string) => (n: number) => n.toFixed(asAsset(asset).precision());
  const [aStr, bStr] = [Str(assetA), Str(assetB)];
  const calcTotal = (a: string, b: string) => bStr(Num(a) * price(Num(b)) || 0);
  const price = (n: number) => (oType === OrderType.Sell ? 1 / n : n);

  const reducer = (state: State, action: Action): State => {
    const { type, payload } = action;

    if (payload && payload.indexOf('-') !== -1) {
      return { ...state };
    }

    const produce = (s: Partial<State>): State => {
      const tmp = { ...state, ...s };
      return { ...tmp, total: calcTotal(tmp.amount, tmp.price) };
    };
    try {
      switch (type) {
        case Update.AMOUNT:
          return produce({ amount: payload });

        case Update.PRICE:
          return produce({ price: payload });

        case Update.INC_AMOUNT:
          return produce({ amount: aStr(incrementFloatNumber(state.price, state.amount, oType)) });

        case Update.INC_PRICE:
          return produce({
            price: bStr(
              Num(state.price) % 1 !== 0
                ? incrementFloatNumber(state.price)
                : Num(state.price) + 1,
            ),
          });

        case Update.DEC_AMOUNT:
          return produce({ amount: aStr(decrementFloatNumber(state.price, state.amount, oType)) });

        case Update.DEC_PRICE:
          return produce({
            price: bStr(
              Num(state.price) === 0
                ? 0
                : Num(state.price) % 1 !== 0
                ? decrementFloatNumber(state.price)
                : Num(state.price) - 1,
            ),
          });

        case Update.TOTAL:
          const amt = Num(state.price) === 0 ? 0 : Num(payload!) / price(Num(state.price));
          return produce({ amount: aStr(amt) });

        case Update.FROM_TOTAL:
          const newAmt = Num(state.price) === 0 ? 0 : Num(payload!) / price(Num(state.price));
          // Not producing here because `produce` updates total internally
          return { ...state, total: payload!, amount: aStr(newAmt) };
        default:
          break;
      }
    } catch (e) {}
    return { ...state };
  };

  return useReducer(reducer, {
    price: '0.00',
    amount: '0.00',
    total: '0.00',
  });
};

export default useOrderState;
