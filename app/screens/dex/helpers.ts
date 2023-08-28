import { AccountBalanceT, AmountT } from '../../services/meta1Api';

export const _amtToReadable = (amt: AmountT, userAssets: AccountBalanceT | null) => {
  const precision =
    userAssets?.assetsWithBalance.find(e => e._asset.id === amt.asset_id)?._asset.precision || 8;
  return amt.amount / 10 ** precision;
};
