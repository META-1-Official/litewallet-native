import { Apis } from 'meta1-vision-ws';
import Meta1, { iLimitOrder } from '../../utils/meta1dexTypes';
import { theAsset } from '../useAsset';
import { ceilFloat, floorFloat } from './math';

const calculateMarketPrice = async (base: theAsset, quote: theAsset, selectedFromBalance) => {
  // console.log('The Asset: ', JSON.stringify(base));
  let _marketPrice = 0;
  let amount = 0;
  let estSellAmount = 0;
  const isQuoting = quote.asset.symbol === 'META1';
  const isTradingMETA1 = base.asset.symbol === 'META1' || quote.asset.symbol === 'META1';

  const _limitOrders = await Meta1.db.get_limit_orders(base.asset.symbol, quote.asset.symbol, 300);
  // console.log('Limit Orders: ', JSON.stringify(_limitOrders));

  //-- Calculate backing asset value
  // const pairTicker = await Meta1.db.get_ticker(base.asset.symbol, quote.asset.symbol);
  // console.log('Ticker: ', JSON.stringify(pairTicker));

  const basePublishedPrice =
    base.asset.symbol !== 'META1'
      ? await Meta1.db.get_published_asset_price(base.asset.symbol)
      : null;
  const quotePublishedPrice =
    quote.asset.symbol !== 'META1'
      ? await Meta1.db.get_published_asset_price(quote.asset.symbol)
      : null;

  const assetLimitation = await Meta1.db.get_asset_limitation_value('META1');

  const meta1_usdt = ceilFloat(assetLimitation / 1000000000, 2);

  const baseAssetPrice = basePublishedPrice
    ? basePublishedPrice.numerator / basePublishedPrice.denominator
    : meta1_usdt;
  const quoteAssetPrice = quotePublishedPrice
    ? quotePublishedPrice.numerator / quotePublishedPrice.denominator
    : meta1_usdt;

  const asset_usdt = isQuoting ? baseAssetPrice : quoteAssetPrice;
  const ratio = isQuoting ? meta1_usdt / asset_usdt : asset_usdt / meta1_usdt;
  const backingAssetValue = isQuoting
    ? ceilFloat(ratio, quote.asset._asset.precision)
    : floorFloat(ratio, quote.asset._asset.precision);
  //--

  for (let limitOrder of _limitOrders) {
    if (limitOrder.sell_price.quote.asset_id === base.asset._asset.id) {
      let divideby;
      let price;

      if (isTradingMETA1 && backingAssetValue) {
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
        if (!isQuoting && backingAssetValue > price) {
          if (!_marketPrice) {
            _marketPrice = price;
          } else {
            _marketPrice = _marketPrice < price ? price : _marketPrice;
          }
        } else if (isQuoting && backingAssetValue < price) {
          if (!_marketPrice) {
            _marketPrice = price;
          } else {
            _marketPrice = _marketPrice > price ? _marketPrice : price;
          }
        }

        if (selectedFromBalance) {
          amount = Number(limitOrder.for_sale) / Math.pow(10, quote.asset._asset.precision);
          estSellAmount += _marketPrice * amount;
          if (estSellAmount > selectedFromBalance) {
            break;
          }
        }
      } else {
        divideby = Math.pow(10, base.asset._asset.precision - quote.asset._asset.precision);
        price = Number(
          limitOrder.sell_price.quote.amount / limitOrder.sell_price.base.amount / divideby,
        );
        _marketPrice = _marketPrice < price ? price : _marketPrice;

        if (selectedFromBalance) {
          amount = Number(limitOrder.for_sale) / Math.pow(10, quote.asset._asset.precision);
          estSellAmount += _marketPrice * amount;
          if (estSellAmount > selectedFromBalance) {
            break;
          }
        }
      }
    }
  }

  if (_marketPrice > 0) {
    const percentDiff = _marketPrice + _marketPrice / Math.pow(10, 3);

    if (isTradingMETA1 && backingAssetValue) {
      const diff = Math.abs(_marketPrice - backingAssetValue) / 2;

      if (!isQuoting) {
        if (percentDiff >= backingAssetValue) {
          _marketPrice = _marketPrice + diff;
        } else {
          _marketPrice = percentDiff;
        }
      } else {
        _marketPrice = percentDiff;
      }
    } else {
      _marketPrice = percentDiff;
    }

    console.log('marketPrice:', base.asset._asset.symbol, quote.asset._asset.symbol, _marketPrice);
  }

  return _marketPrice;
};

export default calculateMarketPrice;
