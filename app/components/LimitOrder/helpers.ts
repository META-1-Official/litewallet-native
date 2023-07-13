import { OrderType } from './types';

export const incrementFloatNumber = (
  price: string,
  amount?: string,
  orderType?: OrderType,
): number => {
  if (amount && orderType) {
    const integerPartCount = price.split('.')[0].length;
    return +amount + (orderType === OrderType.Sell ? 0.1 : Math.pow(0.1, integerPartCount));
  } else {
    const decimalPartCount = price.split('.')[1].replace(/0+$/g, '').length;
    return +price + Math.pow(0.1, decimalPartCount);
  }
};

export const decrementFloatNumber = (
  price: string,
  amount?: string,
  orderType?: OrderType,
): number => {
  if (amount && orderType) {
    const integerPartCount = price.split('.')[0].length;
    const newAmount =
      +amount - (orderType === OrderType.Sell ? 0.1 : Math.pow(0.1, integerPartCount));
    return newAmount <= 0 ? 0 : newAmount;
  } else {
    const decimalPartCount = price.split('.')[1].replace(/0+$/g, '').length;
    const newPrice = +price - Math.pow(0.1, decimalPartCount);
    return newPrice <= 0 ? 0 : newPrice;
  }
};
