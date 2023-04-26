const calculateMarketLiquidity = async () => {
  let _liquidity = 0;
  setIsLoadingPrice(true);

  const _limitOrders = await Apis.instance()
    .db_api()
    .exec('get_limit_orders', [baseAsset.id, quoteAsset.id, 300]);

  if (_limitOrders && _limitOrders.length > 0) {
    for (let limitOrder of _limitOrders) {
      if (limitOrder.sell_price.quote.asset_id === baseAsset.id) {
        let divideby;
        let price;

        if (backingAssetValue) {
          const isQuoting = selectedTo.value === 'META1';

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
            _liquidity += Number(limitOrder.for_sale) / Math.pow(10, quoteAsset.precision);
          } else if (isQuoting && backingAssetValue < price) {
            _liquidity += Number(limitOrder.for_sale) / Math.pow(10, quoteAsset.precision);
          }
        } else {
          _liquidity += Number(limitOrder.for_sale) / Math.pow(10, quoteAsset.precision);
        }
      }
    }
  }

  setIsLoadingPrice(false);
  return parseFloat(_liquidity.toFixed(6));
};
