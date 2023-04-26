const calculateMarketPrice = async (baseAsset, quoteAsset, selectedFromBalance) => {
  let _marketPrice = 0;
  let amount = 0;
  let estSellAmount = 0;
  const isQuoting = selectedTo.value === 'META1';
  const isTradingMETA1 = selectedFrom.value === 'META1' || selectedTo.value === 'META1';

  const _limitOrders = await Apis.instance()
    .db_api()
    .exec('get_limit_orders', [baseAsset.id, quoteAsset.id, 300]);
  setLimitOrders(_limitOrders);

  for (let limitOrder of _limitOrders) {
    if (limitOrder.sell_price.quote.asset_id === baseAsset.id) {
      let divideby;
      let price;

      if (isTradingMETA1 && backingAssetValue) {
        if (!isQuoting) {
          divideby = Math.pow(10, baseAsset.precision - quoteAsset.precision);
          price = Number(
            limitOrder.sell_price.quote.amount / limitOrder.sell_price.base.amount / divideby,
          );
        } else {
          divideby = Math.pow(10, quoteAsset.precision - baseAsset.precision);
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
          amount = Number(limitOrder.for_sale) / Math.pow(10, quoteAsset.precision);
          estSellAmount += _marketPrice * amount;
          if (estSellAmount > selectedFromBalance) {
            break;
          }
        }
      } else {
        divideby = Math.pow(10, baseAsset.precision - quoteAsset.precision);
        price = Number(
          limitOrder.sell_price.quote.amount / limitOrder.sell_price.base.amount / divideby,
        );
        _marketPrice = _marketPrice < price ? price : _marketPrice;

        if (selectedFromBalance) {
          amount = Number(limitOrder.for_sale) / Math.pow(10, quoteAsset.precision);
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

    console.log('marketPrice:', baseAsset.symbol, quoteAsset.symbol, _marketPrice);
    setIsInputsEnabled(true);
    setMarketPrice(_marketPrice);
  }

  setIsLoadingPrice(false);
  return _marketPrice;
};
