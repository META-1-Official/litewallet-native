const calculateMarketPrice = async (baseAsset, quoteAsset) => {
  const marketPrice = (
    (Number(baseAsset.ticker?.lowest_ask) + Number(baseAsset.ticker?.highest_bid)) /
    2
  ).toFixed(baseAsset.asset._asset.precision);
  console.log('!!! !!! MarketPrice: ', marketPrice);

  return marketPrice;
};

export default calculateMarketPrice;
