// Function to round up a float to a certain precision
import { iLimitOrder } from '../meta1dexTypes';

export const ceilFloat = (floatVal: number, precision: number): number => {
  const multiplier = Math.pow(10, precision);
  return Math.ceil(floatVal * multiplier) / multiplier;
};

// Function to round down a float to a certain precision
export const floorFloat = (floatVal: number, precision: number): number => {
  const multiplier = Math.pow(10, precision);
  return Math.floor(floatVal * multiplier) / multiplier;
};

// Function to handle float numbers with exponential notation,
// converting them to a fixed number representation
export const expFloatToFixed = (x: number): string => {
  let e: number;

  // For small numbers (absolute value less than 1), adjust the decimal point to the left
  if (Math.abs(x) < 1.0) {
    e = parseInt(x.toString().split('e-')[1], 10);

    if (e) {
      x *= Math.pow(10, e - 1);
      x = Number('0.' + new Array(e).join('0') + x.toString().substring(2));
    }
  } else {
    // For large numbers (absolute value greater than 1), adjust the decimal point to the right
    e = parseInt(x.toString().split('+')[1], 10);

    if (e > 20) {
      e -= 20;
      x /= Math.pow(10, e);
      x += Number(new Array(e + 1).join('0'));
    }
  }

  return x.toString();
};

export const calculateDivideBy = (basePrecision: number, quotePrecision: number): number => {
  return Math.pow(10, basePrecision - quotePrecision);
};

export const calculatePrice = (limitOrder: iLimitOrder, divideBy: number): number => {
  return limitOrder.sell_price.quote.amount / limitOrder.sell_price.base.amount / divideBy;
};

export const calculateAmount = (limitOrder: iLimitOrder, quotePrecision: number): number => {
  return Number(limitOrder.for_sale) / Math.pow(10, quotePrecision);
};
