const calculateMarketPrice = (assetA, assetB) => {
  const marketPrice = (
    (Number(assetA.ticker?.lowest_ask) + Number(assetA.ticker?.highest_bid)) /
    2
  ).toFixed(assetA.asset._asset.precision);
  console.log('!!! !!! MarketPrice: ', marketPrice);

  return marketPrice;
};

export default calculateMarketPrice;
