export enum OrderType {
  Buy = 'BUY',
  Sell = 'SELL',
}

export enum Update {
  PRICE = 'PRICE',
  AMOUNT = 'AMOUNT',
  TOTAL = 'TOTAL',
  INC_PRICE = 'INC_PRICE',
  INC_AMOUNT = 'INC_AMOUNT',
  DEC_PRICE = 'DEC_PRICE',
  DEC_AMOUNT = 'DEC_AMOUNT',
  FROM_TOTAL = 'FROM_TOTAL',
}

export interface State {
  price: string;
  amount: string;
  total: string;
}

export interface Action {
  type: Update;
  payload?: string;
}
