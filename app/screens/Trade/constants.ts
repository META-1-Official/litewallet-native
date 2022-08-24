import { ScreenAssets } from './types';

export const editing: any = { current: null };

export const makeMessage = (assets: ScreenAssets) =>
  `Successfully traded ${assets.A.amount} ${assets.A.asset.symbol}` +
  ' to ' +
  `${assets.B.amount} ${assets.B.asset.symbol}`;

export const validateNumber = (t: string) => /^(\d+([.,]\d+)?)$/m.test(t);
