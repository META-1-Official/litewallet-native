import React, { useEffect, useState } from 'react';
import { tid } from '../../utils';
import { DM, AssetProp } from './types';
import { optStyleFactory, validateNumber } from './helpers';
import useCause from './useCause';
import Input from './Input';

import styles from './TradeScreen.styles';

const AmountInput = ({ asset, darkMode }: DM<AssetProp>) => {
  const [amount, setAmount] = useState(asset.amount);
  const { isCause, cause } = useCause();

  useEffect(() => {
    if (!isCause) {
      setAmount(asset.amount);
    }
  }, [asset.amount, isCause]);

  const darkStyle = optStyleFactory(darkMode);

  return (
    <Input
      {...tid('TradeScreen/AmountInput/amount')}
      style={darkStyle(styles.whiteText, styles.amountInput)}
      value={amount}
      validate={validateNumber}
      keyboardType="numeric"
      onChange={(txt, valid) => {
        cause();
        setAmount(txt);
        if (valid) {
          asset.setAmount(txt);
          const opponent = asset.opponent();
          opponent.setAmount(
            (+txt * opponent.marketPrice).toFixed(opponent.asset._asset.precision),
          );
        }
      }}
    />
  );
};

export default AmountInput;
